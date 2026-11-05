import { readdir, rm, rmdir, stat } from 'node:fs/promises';
import { dirname, isAbsolute, join, relative } from 'node:path';
import { homedir } from 'node:os';

/**
 * Хостовая половина удаления архивных сессий.
 *
 * Два входа:
 *  - `POST /api/session.purge` — для корзины в сайдбаре; маршрут живёт на
 *    `/api`-мосте Connection и не требует открытой сессии;
 *  - команда `/delete-archived <session-id>` — ручной вызов из композера и
 *    резерв для композиций без Connection.
 *
 * Оба входа делают одно и то же: удаляют каталог журнала, кэш проекций и
 * запись в реестре проектов (архивный набор + привязка к проекту).
 */

const SESSION_ID = /^session-[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/;
const COMMAND = 'delete-archived';
const ROUTE = '/api/session.purge';

export const inject = ['commands'];

/** Единый отказ хост-половины: код для HTTP-статуса и текст для человека. */
function failure(code, message) {
  return { ok: false, code, message };
}

function errorText(error) {
  return error instanceof Error ? error.message : String(error);
}

/** Корень DSH: рядом с каталогом журналов лежит `storages`. */
function dshHome() {
  const fromEnv = process.env.DSH_HOME;
  if (typeof fromEnv === 'string' && fromEnv.length > 0) return fromEnv;
  return join(homedir(), '.dsh');
}

/** Корень журналов: публичное поле root у jsonl-бэкенда, иначе штатный путь. */
function sessionRoot(persistence) {
  if (persistence !== undefined && typeof persistence.root === 'string' && persistence.root.length > 0) {
    return persistence.root;
  }
  return join(dshHome(), 'sessions');
}

async function statSession(persistence, id) {
  if (persistence === undefined || typeof persistence.stat !== 'function') return undefined;
  try {
    return await persistence.stat(id);
  } catch (error) {
    return undefined;
  }
}

/** Удалять можно только каталоги внутри корня журналов, никогда сам корень. */
function isInsideRoot(root, dir) {
  const rel = relative(root, dir);
  return rel !== '' && !rel.startsWith('..') && !isAbsolute(rel);
}

/**
 * Каталог журнала лежит в `<root>/<проект>/<имя>/`, где имя — либо полный id
 * (`session-<uuid>`, так пишут обычные сессии), либо голый uuid (старые записи
 * и субагентские сессии). Сначала берём точный путь из `stat()`, затем
 * проверяем оба написания в проектных каталогах.
 */
async function locateSessionDirs(root, id, uuid, location) {
  const dirs = [];
  const add = (dir) => {
    if (typeof dir === 'string' && dir.length > 0 && isInsideRoot(root, dir) && !dirs.includes(dir)) dirs.push(dir);
  };
  if (typeof location === 'string' && location.length > 0) add(dirname(location));

  let projects;
  try {
    projects = await readdir(root, { withFileTypes: true });
  } catch (error) {
    return dirs;
  }
  for (const project of projects) {
    if (!project.isDirectory()) continue;
    for (const name of [id, uuid]) {
      const candidate = join(root, project.name, name);
      try {
        if ((await stat(candidate)).isDirectory()) add(candidate);
      } catch (error) {
        // продолжаем поиск
      }
    }
  }
  return dirs;
}

/**
 * Кэш проекций: сначала удаляем запись через открытый домен (тогда память
 * storage-json согласована с диском), затем добиваем файлы legacy-записей.
 */
async function deleteProjectionCache(ctx, id, uuid) {
  let removed = false;

  const storageDomain = ctx.get('storageDomain');
  if (storageDomain !== undefined && typeof storageDomain.get === 'function') {
    const domain = storageDomain.get('session_projcache');
    const table = domain !== undefined && typeof domain.table === 'function'
      ? domain.table('sessions')
      : undefined;
    if (table !== undefined && typeof table.delete === 'function') {
      try {
        if (await table.delete(id)) removed = true;
      } catch (error) {
        ctx.logger?.warn?.(`session-purge: кэш не удалён через storageDomain: ${errorText(error)}`);
      }
    }
  }

  const cacheDir = join(dshHome(), 'storages', 'session_projcache', 'sessions');
  for (const name of [`${id}.json`, `${uuid}.json`]) {
    const file = join(cacheDir, name);
    try {
      await stat(file);
    } catch (error) {
      continue;
    }
    try {
      await rm(file, { force: true });
      removed = true;
    } catch (error) {
      ctx.logger?.warn?.(`session-purge: кэш ${name} не удалён: ${errorText(error)}`);
    }
  }
  return removed;
}

/** Убрать id из архивного набора и из всех проектов, где он ещё числится. */
async function cleanRegistry(registry, id) {
  let archivedCleaned = true;
  let workspacesCleaned = true;

  try {
    await registry.unarchiveSession(id);
  } catch (error) {
    archivedCleaned = false;
  }

  let workspaces;
  try {
    workspaces = registry.list();
  } catch (error) {
    workspaces = [];
    workspacesCleaned = false;
  }
  for (const workspace of workspaces) {
    if (!Array.isArray(workspace.sessionIds) || !workspace.sessionIds.includes(id)) continue;
    try {
      await workspace.detachSession(id);
    } catch (error) {
      workspacesCleaned = false;
    }
  }

  return { archivedCleaned, workspacesCleaned };
}

/**
 * Безвозвратно удалить одну архивную сессию.
 *
 * @param {object} ctx хост-контекст Cordis.
 * @param {string} id идентификатор `session-<uuid>`.
 * @param {{ agent?: object, check?: boolean, signal?: AbortSignal }} [options]
 * @returns {Promise<object>} `{ ok: true, … }` или `{ ok: false, code, message }`.
 */
export async function purgeArchivedSession(ctx, id, options = {}) {
  if (!SESSION_ID.test(id)) return failure('bad-id', 'Нужен идентификатор вида session-<uuid>.');
  options.signal?.throwIfAborted?.();

  const registry = ctx.get('workspaceRegistry');
  if (registry === undefined) return failure('unavailable', 'Реестр проектов недоступен.');

  const uuid = id.slice('session-'.length);
  const sessions = ctx.get('sessions');
  if (sessions !== undefined && (sessions.get(id) !== undefined || sessions.get(uuid) !== undefined)) {
    return failure('live', 'Сессия ещё загружена в память — перезапустите DSH и повторите.');
  }
  if (options.agent !== undefined && options.agent.session?.id === id) {
    return failure('live', 'Нельзя удалить сессию, в которой выполняется команда.');
  }

  const archived = Array.isArray(registry.archivedSessionIds) && registry.archivedSessionIds.includes(id);
  const persistence = ctx.get('sessionPersistence');
  const root = sessionRoot(persistence);
  const snapshot = await statSession(persistence, id);
  const dirs = await locateSessionDirs(root, id, uuid, snapshot?.location?.path);

  // Не архивная, но файлов и кэша уже нет: значит, запись осталась только в
  // реестре (например, после ручного удаления). Чистим её и считаем успехом.
  if (!archived) {
    if (dirs.length > 0) return failure('not-archived', 'Удалять можно только архивные сессии.');
    const cacheRemoved = await deleteProjectionCache(ctx, id, uuid);
    const cleaned = await cleanRegistry(registry, id);
    return {
      ok: true,
      sessionId: id,
      alreadyGone: true,
      filesRemoved: 0,
      cacheRemoved,
      ...cleaned,
    };
  }

  if (options.check === true) {
    return {
      ok: true,
      sessionId: id,
      check: true,
      dirs: dirs.slice(),
    };
  }

  let filesRemoved = 0;
  for (const dir of dirs) {
    if (!isInsideRoot(root, dir)) return failure('io', `Отказано: ${dir} находится вне корня журналов.`);
    try {
      await rm(dir, { recursive: true, force: true });
      filesRemoved += 1;
    } catch (error) {
      return failure('io', `Не удалось удалить журнал ${dir}: ${errorText(error)}`);
    }
  }

  // Пустой проектный каталог после удаления последней сессии не нужен.
  for (const dir of dirs) {
    const parent = dirname(dir);
    if (!isInsideRoot(root, parent)) continue;
    try {
      await rmdir(parent);
    } catch (error) {
      // каталог не пуст — оставляем
    }
  }

  const cacheRemoved = await deleteProjectionCache(ctx, id, uuid);
  const cleaned = await cleanRegistry(registry, id);

  const warnings = [];
  if (!cleaned.archivedCleaned) warnings.push('запись в архиве не очищена');
  if (!cleaned.workspacesCleaned) warnings.push('привязка к проекту не очищена');

  return {
    ok: true,
    sessionId: id,
    alreadyGone: filesRemoved === 0,
    filesRemoved,
    cacheRemoved,
    ...cleaned,
    warnings,
  };
}

function statusFor(result) {
  if (result.ok === true) return 200;
  switch (result.code) {
    case 'bad-id': return 400;
    case 'not-archived':
    case 'live': return 409;
    case 'unavailable': return 503;
    default: return 500;
  }
}

function jsonResponse(status, body) {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      'content-type': 'application/json; charset=utf-8',
      'cache-control': 'no-store',
    },
  });
}

/** Зарегистрировать HTTP-маршрут, если в композиции есть Connection. */
function registerRoute(ctx) {
  ctx.inject(['connection'], (scoped) => {
    scoped.effect(() => {
      const connection = scoped.get('connection');
      try {
        return connection.fetch.register({
          path: ROUTE,
          methods: ['POST'],
          requestBody: 'buffered',
          fetch: async (request) => {
            let payload;
            try {
              payload = await request.json();
            } catch (error) {
              return jsonResponse(400, failure('bad-id', 'Ожидался JSON вида { "sessionId": "session-<uuid>" }.'));
            }
            const sessionId = payload !== null && typeof payload === 'object' && typeof payload.sessionId === 'string'
              ? payload.sessionId.trim()
              : '';
            try {
              const result = await purgeArchivedSession(scoped, sessionId, { signal: request.signal });
              return jsonResponse(statusFor(result), result);
            } catch (error) {
              return jsonResponse(500, failure('io', `Удаление не выполнено: ${errorText(error)}`));
            }
          },
        });
      } catch (error) {
        scoped.logger?.warn?.(`session-purge: маршрут ${ROUTE} не зарегистрирован: ${errorText(error)}`);
        return undefined;
      }
    }, 'session-purge: fetch route');
  });
}

export function apply(ctx) {
  ctx.effect(() => ctx.commands.register({
    name: COMMAND,
    description: 'Удалить архивную сессию навсегда: журнал, кэш и запись в реестре.',
    input: { hint: '<session-id>' },
    handler: async ({ rawInput, agent }) => {
      const raw = String(rawInput ?? '').trim();
      const dryRun = /^--(check|dry-run)\s+/.test(raw);
      const id = dryRun ? raw.replace(/^--(check|dry-run)\s+/, '').trim() : raw;
      const result = await purgeArchivedSession(ctx, id, { agent, check: dryRun });
      if (result.ok !== true) return { kind: 'error', text: result.message };

      if (result.check === true) {
        return {
          kind: 'success',
          text: result.dirs.length > 0
            ? `Проверка: каталог найден — ${result.dirs.join(', ')}`
            : 'Проверка: файлы сессии уже отсутствуют, запись в реестре ещё есть.',
        };
      }

      const suffix = result.warnings !== undefined && result.warnings.length > 0
        ? ` Не удалось: ${result.warnings.join(', ')}.`
        : '';
      return {
        kind: 'success',
        text: result.alreadyGone === true
          ? `Сессия ${id} уже отсутствовала; запись в архиве очищена.${suffix}`
          : `Сессия ${id} удалена безвозвратно.${suffix}`,
      };
    },
  }), 'session-purge: delete-archived');

  registerRoute(ctx);
}
