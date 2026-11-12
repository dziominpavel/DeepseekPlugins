/**
 * dsh-skillpack — переносимый рабочий набор: навыки и команды в одном пакете.
 *
 * Навыки (`skills/<имя>/SKILL.md` или `skills/<имя>.md`) регистрируются в
 * `ctx.skills`: их видит модель, они показываются в меню «/», а вызов `/имя`
 * в сообщении вставляет навык в диалог как `<skill_content>`.
 *
 * Команды (`commands/<имя>.md`) регистрируются в `ctx.commands`: при вызове
 * промпт из тела файла уходит в диалог от имени пользователя, `$ARGUMENTS`
 * заменяется текстом после имени команды.
 *
 * Служебная `/kit` показывает, что сейчас загружено. Каталог перечитывается
 * при изменении файлов, поэтому новые навыки и правки текстов подхватываются
 * без перезапуска DSH.
 */

import { randomUUID } from 'node:crypto';
import { existsSync, readdirSync, readFileSync, statSync, watch } from 'node:fs';
import { basename, dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const PACK_ROOT = dirname(fileURLToPath(import.meta.url));
const SKILLS_DIR = join(PACK_ROOT, 'skills');
const COMMANDS_DIR = join(PACK_ROOT, 'commands');

/** Имя навыка: нижний регистр, цифры и дефисы — грамматика DSH. */
const SKILL_NAME = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
/** Имя команды: то же, но с подчёркиванием и без висячего дефиса. */
const COMMAND_NAME = /^[a-z0-9][a-z0-9_-]*$/;
/** Служебная команда набора; файл с таким именем не перекрывает её. */
const KIT_COMMAND = 'kit';
/** Пауза после серии событий файловой системы, мс. */
const SETTLE_MS = 300;
/** Контрольное перечитывание после серии: копирование пачкой приходит с опозданием, мс. */
const RESYNC_MS = 1500;
/** Страховка от потерянных событий: редкая сверка каталога, мс. */
const POLL_MS = 60_000;

/** Что реально зарегистрировано сейчас: источник для `/kit`. */
const catalog = {
  skills: new Map(),
  commands: new Map(),
};

function errorText(error) {
  return error instanceof Error ? error.message : String(error);
}

function warn(ctx, message) {
  try {
    ctx.logger?.warn?.(`skillpack: ${message}`);
  } catch {
    // журнал недоступен — молча продолжаем, набор важнее диагностики
  }
}

/** Метка версии файла: правка или переименование меняют её. */
function stampOf(file) {
  const info = statSync(file, { throwIfNoEntry: false });
  return info === undefined ? undefined : `${info.mtimeMs}:${info.size}`;
}

/**
 * Разобрать YAML-заголовок файла. Поддерживаются плоские пары `ключ: значение`
 * и кавычки; вложенные структуры не нужны и молча пропускаются.
 *
 * @param {string} raw содержимое файла.
 * @returns {{ fields: Record<string, string | boolean>, body: string }}
 */
function splitFrontmatter(raw) {
  const text = raw.replace(/^\uFEFF/, '').replace(/\r\n?/g, '\n');
  const lines = text.split('\n');
  if (lines[0]?.trim() !== '---') return { fields: {}, body: text.trim() };
  const close = lines.findIndex((line, index) => index > 0 && line.trim() === '---');
  if (close === -1) return { fields: {}, body: text.trim() };

  const fields = {};
  for (const line of lines.slice(1, close)) {
    const match = /^([A-Za-z][A-Za-z0-9_-]*)\s*:\s*(.*)$/.exec(line);
    if (match === null) continue;
    fields[match[1]] = scalar(match[2]);
  }
  return { fields, body: lines.slice(close + 1).join('\n').trim() };
}

function scalar(value) {
  const text = value.trim();
  const quoted = text.length > 1
    && ((text.startsWith('"') && text.endsWith('"')) || (text.startsWith("'") && text.endsWith("'")));
  if (quoted) return text.slice(1, -1).replace(/\\n/g, '\n');
  if (text === 'true') return true;
  if (text === 'false') return false;
  return text;
}

function oneLine(value) {
  return typeof value === 'string' ? value.replace(/\s+/g, ' ').trim() : '';
}

/**
 * Прочитать навыки набора.
 *
 * @param {object} ctx контекст для журнала.
 * @returns {Map<string, { stamp: string, definition: object }>}
 */
function readSkills(ctx) {
  const found = new Map();
  let entries;
  try {
    entries = readdirSync(SKILLS_DIR, { withFileTypes: true });
  } catch {
    return found;
  }

  const add = (file, directory) => {
    const stamp = stampOf(file);
    if (stamp === undefined) return;
    let raw;
    try {
      raw = readFileSync(file, 'utf8');
    } catch (error) {
      warn(ctx, `${file}: не читается — ${errorText(error)}`);
      return;
    }
    const { fields, body } = splitFrontmatter(raw);
    const name = typeof fields.name === 'string' ? fields.name : '';
    const description = oneLine(fields.description);
    if (!SKILL_NAME.test(name)) {
      warn(ctx, `${file}: нужен name из строчных латинских букв, цифр и дефисов`);
      return;
    }
    if (description === '') {
      warn(ctx, `${file}: нужна непустая description — она видна в каталоге навыков`);
      return;
    }
    if (body === '') {
      warn(ctx, `${file}: пустое тело навыка`);
      return;
    }
    if (found.has(name)) {
      warn(ctx, `${file}: навык «${name}» уже объявлен выше`);
      return;
    }
    const folder = basename(directory) === basename(SKILLS_DIR) ? basename(file, '.md') : basename(directory);
    if (folder !== name) {
      warn(ctx, `${file}: name «${name}» не совпадает с именем каталога/файла «${folder}»`);
    }
    const whenToUse = oneLine(fields.whenToUse ?? fields['when-to-use']);
    found.set(name, {
      stamp,
      definition: {
        name,
        description,
        content: body,
        ...(whenToUse === '' ? {} : { whenToUse }),
        invocation: {
          modelInvocable: fields['disable-model-invocation'] !== true,
          userInvocable: fields['user-invocable'] !== false,
        },
        source: 'skillpack',
        path: file,
        resourceBase: { kind: 'directory', path: directory },
      },
    });
  };

  for (const entry of entries) {
    if (entry.name.startsWith('.')) continue;
    if (entry.isDirectory()) {
      const directory = join(SKILLS_DIR, entry.name);
      const file = join(directory, 'SKILL.md');
      if (!existsSync(file)) {
        warn(ctx, `${directory}: нет SKILL.md`);
        continue;
      }
      add(file, directory);
      continue;
    }
    if (entry.isFile() && entry.name.endsWith('.md')) add(join(SKILLS_DIR, entry.name), SKILLS_DIR);
  }
  return found;
}

/**
 * Прочитать команды-промпты набора.
 *
 * @param {object} ctx контекст для журнала.
 * @returns {Map<string, { stamp: string, description: string, hint?: string, template: string }>}
 */
function readCommands(ctx) {
  const found = new Map();
  let entries;
  try {
    entries = readdirSync(COMMANDS_DIR, { withFileTypes: true });
  } catch {
    return found;
  }

  for (const entry of entries) {
    if (!entry.isFile() || !entry.name.endsWith('.md') || entry.name.startsWith('.')) continue;
    const file = join(COMMANDS_DIR, entry.name);
    const name = basename(entry.name, '.md');
    const stamp = stampOf(file);
    if (stamp === undefined) continue;
    if (!COMMAND_NAME.test(name)) {
      warn(ctx, `${file}: имя команды — строчные буквы, цифры, «_» и «-»`);
      continue;
    }
    if (name === KIT_COMMAND) {
      warn(ctx, `${file}: имя /${KIT_COMMAND} занято служебной командой набора`);
      continue;
    }
    let raw;
    try {
      raw = readFileSync(file, 'utf8');
    } catch (error) {
      warn(ctx, `${file}: не читается — ${errorText(error)}`);
      continue;
    }
    const { fields, body } = splitFrontmatter(raw);
    const description = oneLine(fields.description);
    if (description === '') {
      warn(ctx, `${file}: нужна description — она видна в меню «/»`);
      continue;
    }
    if (body === '') {
      warn(ctx, `${file}: пустой промпт`);
      continue;
    }
    const hint = oneLine(fields.hint);
    found.set(name, {
      stamp,
      description,
      ...(hint === '' ? {} : { hint }),
      template: body,
    });
  }
  return found;
}

/**
 * Подставить аргументы в промпт. `$ARGUMENTS` — весь текст после имени
 * команды; без плейсхолдера ввод добавляется отдельным абзацем.
 */
function renderTemplate(template, input) {
  if (!template.includes('$ARGUMENTS')) return input === '' ? template : `${template}\n\n${input}`;
  return template.replaceAll('$ARGUMENTS', input).replace(/\n{3,}/g, '\n\n').trim();
}

/** Отправить готовый промпт в диалог от имени пользователя. */
function submitPrompt(agent, name, template, rawInput) {
  if (agent === undefined || typeof agent.steer !== 'function') {
    return { kind: 'error', text: `/${name}: команда работает только внутри сессии.` };
  }
  const text = renderTemplate(template, String(rawInput ?? '').trim());
  try {
    agent.steer({
      id: randomUUID(),
      role: 'user',
      content: [{ type: 'text', text }],
      source: { kind: 'user' },
    });
  } catch (error) {
    return { kind: 'error', text: `/${name}: промпт не отправлен — ${errorText(error)}` };
  }
  return { kind: 'success', text: `/${name}: промпт отправлен в диалог.` };
}

/** Прочитать каталог набора в виде строк для `/kit`. */
function kitReport() {
  const skills = [...catalog.skills.entries()].sort((left, right) => left[0].localeCompare(right[0]));
  const commands = [...catalog.commands.entries()].sort((left, right) => left[0].localeCompare(right[0]));
  const lines = [`Набор: ${PACK_ROOT}`, ''];
  lines.push(skills.length === 0 ? 'Навыки: пока пусто.' : `Навыки (${skills.length}):`);
  for (const [name, description] of skills) lines.push(`  /${name} — ${description}`);
  lines.push('');
  lines.push(commands.length === 0 ? 'Команды: пока пусто.' : `Команды (${commands.length}):`);
  for (const [name, description] of commands) lines.push(`  /${name} — ${description}`);
  lines.push('');
  lines.push('Правки в skills/ и commands/ подхватываются без перезапуска.');
  return lines.join('\n');
}

/**
 * Следить за каталогом и звать `onChange` после серии изменений.
 *
 * @returns {(() => void) | undefined} остановка наблюдения, если она удалась.
 */
function watchPack(ctx, directory, onChange) {
  if (!existsSync(directory)) {
    warn(ctx, `${directory} не найден — изменения подхватываться не будут`);
    return undefined;
  }
  let settle;
  let trailing;

  const run = () => {
    try {
      onChange();
    } catch (error) {
      warn(ctx, `перечитывание ${directory} не удалось: ${errorText(error)}`);
    }
  };

  const schedule = () => {
    if (settle !== undefined) clearTimeout(settle);
    settle = setTimeout(() => {
      settle = undefined;
      run();
      // Копирование пачкой файлов может закончиться уже после серии событий:
      // одно контрольное перечитывание ловит то, что не успело попасть в первую.
      if (trailing !== undefined) clearTimeout(trailing);
      trailing = setTimeout(() => {
        trailing = undefined;
        run();
      }, RESYNC_MS);
      trailing.unref?.();
    }, SETTLE_MS);
    settle.unref?.();
  };

  try {
    const watcher = watch(directory, { recursive: true }, schedule);
    watcher.on('error', (error) => warn(ctx, `наблюдение за ${directory} остановлено: ${errorText(error)}`));
    const poll = setInterval(run, POLL_MS);
    poll.unref?.();
    return () => {
      if (settle !== undefined) clearTimeout(settle);
      if (trailing !== undefined) clearTimeout(trailing);
      clearInterval(poll);
      watcher.close();
    };
  } catch (error) {
    warn(ctx, `изменения в ${directory} не отслеживаются: ${errorText(error)}`);
    return undefined;
  }
}

/** Зарегистрировать навыки и держать их в согласии с каталогом. */
function installSkills(ctx) {
  const active = new Map();
  let stopped = false;

  const sync = () => {
    if (stopped) return;
    const found = readSkills(ctx);
    for (const [name, current] of [...active]) {
      const next = found.get(name);
      if (next !== undefined && next.stamp === current.stamp) continue;
      try {
        current.dispose();
      } catch (error) {
        warn(ctx, `навык «${name}» не снят: ${errorText(error)}`);
      }
      active.delete(name);
      catalog.skills.delete(name);
    }
    for (const [name, entry] of found) {
      if (active.has(name)) continue;
      try {
        const dispose = ctx.skills.register(entry.definition);
        active.set(name, { stamp: entry.stamp, dispose });
        catalog.skills.set(name, entry.definition.description);
      } catch (error) {
        warn(ctx, `навык «${name}» не зарегистрирован: ${errorText(error)}`);
      }
    }
  };

  sync();
  const stopWatching = watchPack(ctx, SKILLS_DIR, sync);
  ctx.effect(() => () => {
    stopped = true;
    stopWatching?.();
    for (const [name, current] of active) {
      try {
        current.dispose();
      } catch {
        // снятие навыка при выгрузке не должно мешать остальным
      }
      catalog.skills.delete(name);
    }
    active.clear();
  }, 'skillpack: skills');
}

/** Зарегистрировать команды набора вместе со служебной `/kit`. */
function installCommands(ctx) {
  const active = new Map();
  let stopped = false;

  const kit = ctx.commands.register({
    name: KIT_COMMAND,
    description: 'Показать, что лежит в наборе навыков и команд.',
    handler: () => ({ kind: 'success', text: kitReport() }),
  });

  const sync = () => {
    if (stopped) return;
    const found = readCommands(ctx);
    for (const [name, current] of [...active]) {
      const next = found.get(name);
      if (next !== undefined && next.stamp === current.stamp) continue;
      try {
        current.dispose();
      } catch (error) {
        warn(ctx, `команда «${name}» не снята: ${errorText(error)}`);
      }
      active.delete(name);
      catalog.commands.delete(name);
    }
    for (const [name, entry] of found) {
      if (active.has(name)) continue;
      try {
        const dispose = ctx.commands.register({
          name,
          description: entry.description,
          ...(entry.hint === undefined ? {} : { input: { hint: entry.hint } }),
          handler: ({ rawInput, agent }) => submitPrompt(agent, name, entry.template, rawInput),
        });
        active.set(name, { stamp: entry.stamp, dispose });
        catalog.commands.set(name, entry.description);
      } catch (error) {
        warn(ctx, `команда «${name}» не зарегистрирована: ${errorText(error)}`);
      }
    }
  };

  sync();
  const stopWatching = watchPack(ctx, COMMANDS_DIR, sync);
  ctx.effect(() => () => {
    stopped = true;
    stopWatching?.();
    for (const [name, current] of active) {
      try {
        current.dispose();
      } catch {
        // снятие команды при выгрузке не должно мешать остальным
      }
      catalog.commands.delete(name);
    }
    active.clear();
    try {
      kit();
    } catch (error) {
      warn(ctx, `/${KIT_COMMAND} не снята: ${errorText(error)}`);
    }
  }, 'skillpack: commands');
}

export function apply(ctx) {
  ctx.inject(['skills'], (scoped) => {
    try {
      installSkills(scoped);
    } catch (error) {
      warn(scoped, `навыки не загружены: ${errorText(error)}`);
    }
  });
  ctx.inject(['commands'], (scoped) => {
    try {
      installCommands(scoped);
    } catch (error) {
      warn(scoped, `команды не загружены: ${errorText(error)}`);
    }
  });
}
