import { readdir, rm, stat } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { homedir } from 'node:os';

/**
 * Хостовая половина: команда `/delete-archived <session-id>`.
 *
 * У DSH нет штатного удаления сессий (они только архивируются), поэтому команда
 * делает это сама и только для архивных записей: удаляет каталог журнала,
 * кэш проекций и запись в реестре проектов (архивный набор + привязка к проекту).
 * Живые сессии и текущую сессию удалить нельзя.
 */

const SESSION_ID = /^session-[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/;
const COMMAND = 'delete-archived';

function failure(text) {
  return { kind: 'error', text };
}

/**
 * Каталог журнала лежит в `<root>/<проект>/<имя>/`, где имя — либо полный id
 * (`session-<uuid>`, так пишут обычные сессии), либо голый uuid (старые записи
 * и субагентские сессии). Проверяем оба написания.
 */
async function locateSessionDir(root, id, uuid) {
  let entries;
  try {
    entries = await readdir(root, { withFileTypes: true });
  } catch (error) {
    return undefined;
  }
  for (const entry of entries) {
    if (!entry.isDirectory()) continue;
    for (const name of [id, uuid]) {
      const candidate = join(root, entry.name, name);
      try {
        if ((await stat(candidate)).isDirectory()) return candidate;
      } catch (error) {
        // продолжаем поиск
      }
    }
  }
  return undefined;
}

/** Корень DSH: рядом с каталогом журналов лежит `storages`. */
function homeOf(root) {
  if (typeof root === 'string' && root.length > 0) return dirname(root);
  return process.env.DSH_HOME || join(homedir(), '.dsh');
}

export const inject = ['commands'];

export function apply(ctx) {
  ctx.effect(() => ctx.commands.register({
    name: COMMAND,
    description: 'Удалить архивную сессию навсегда: журнал, кэш и запись в реестре.',
    input: { hint: '<session-id>' },
    handler: async ({ rawInput, agent }) => {
      const raw = String(rawInput ?? '').trim();
      const dryRun = /^--(check|dry-run)\s+/.test(raw);
      const id = dryRun ? raw.replace(/^--(check|dry-run)\s+/, '').trim() : raw;
      if (!SESSION_ID.test(id)) return failure('Нужен идентификатор вида session-<uuid>.');

      const registry = ctx.get('workspaceRegistry');
      if (registry === undefined) return failure('Реестр проектов недоступен.');
      if (!registry.archivedSessionIds.includes(id)) return failure('Удалять можно только архивные сессии.');

      const uuid = id.slice('session-'.length);
      const sessions = ctx.get('sessions');
      if (sessions !== undefined && (sessions.get(id) !== undefined || sessions.get(uuid) !== undefined)) {
        return failure('Сессия ещё загружена в память — перезапустите DSH и повторите.');
      }
      if (agent !== undefined && agent.session?.id === id) {
        return failure('Нельзя удалить сессию, в которой выполняется команда.');
      }

      const persistence = ctx.get('sessionPersistence');
      const root = persistence?.root;
      if (typeof root !== 'string' || root.length === 0) return failure('Хранилище сессий недоступно.');

      const dir = await locateSessionDir(root, id, uuid);
      if (dir === undefined) return failure('Файлы сессии не найдены — возможно, она уже удалена.');
      if (dryRun) return { kind: 'success', text: `Проверка: каталог найден — ${dir}` };

      try {
        await rm(dir, { recursive: true, force: true });
      } catch (error) {
        return failure(`Не удалось удалить журнал: ${error instanceof Error ? error.message : String(error)}`);
      }

      const cacheRoot = join(homeOf(root), 'storages', 'session_projcache', 'sessions');
      for (const name of [`${id}.json`, `${uuid}.json`]) {
        try {
          await rm(join(cacheRoot, name), { force: true });
        } catch (error) {
          ctx.logger?.warn?.(`session-purge: кэш ${name} не удалён: ${String(error)}`);
        }
      }

      let cleaned = true;
      try {
        const owner = registry.list().find((workspace) => workspace.sessionIds.includes(id));
        await registry.unarchiveSession(id);
        if (owner !== undefined) await owner.detachSession(id);
      } catch (error) {
        cleaned = false;
        ctx.logger?.warn?.(`session-purge: запись реестра не очищена: ${String(error)}`);
      }

      return {
        kind: 'success',
        text: cleaned
          ? `Сессия ${id} удалена безвозвратно.`
          : `Журнал ${id} удалён, но запись в реестре не очищена.`,
      };
    },
  }), 'session-purge: delete-archived');
}
