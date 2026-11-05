// Проверка хост-половины dsh-session-purge на временном DSH_HOME:
// удаление журнала, кэша проекций и записи в реестре без живого DSH.
//
//   node tools/test-session-purge.mjs
import assert from 'node:assert/strict';
import { mkdtemp, mkdir, readFile, rm, stat as fsStat, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { apply, purgeArchivedSession } from '../plugins/dsh-session-purge/index.js';
const id = 'session-11111111-2222-4333-8444-555555555555';
const uuid = id.slice('session-'.length);
const other = 'session-99999999-8888-4777-8666-555555555555';

const home = await mkdtemp(join(tmpdir(), 'dsh-session-purge-'));
const previousHome = process.env.DSH_HOME;
process.env.DSH_HOME = home;

try {
  const projectDir = join(home, 'sessions', '--C-projects-Demo--');
  const sessionDir = join(projectDir, id);
  await mkdir(sessionDir, { recursive: true });
  await writeFile(join(sessionDir, 'session.v4.jsonl.zstd'), 'log');

  const cacheDir = join(home, 'storages', 'session_projcache', 'sessions');
  await mkdir(cacheDir, { recursive: true });
  await writeFile(join(cacheDir, `${id}.json`), '{}');

  const calls = [];
  const workspace = {
    sessionIds: [id, other],
    async detachSession(sessionId) {
      calls.push(['detach', sessionId]);
      this.sessionIds = this.sessionIds.filter((value) => value !== sessionId);
    },
  };
  const registry = {
    archivedSessionIds: [id],
    list: () => [workspace],
    async unarchiveSession(sessionId) {
      calls.push(['unarchive', sessionId]);
      this.archivedSessionIds = this.archivedSessionIds.filter((value) => value !== sessionId);
    },
  };
  const persistence = {
    root: join(home, 'sessions'),
    async stat(sessionId) {
      if (sessionId !== id) return undefined;
      try {
        await fsStat(join(sessionDir, 'session.v4.jsonl.zstd'));
      } catch (error) {
        return undefined;
      }
      return { location: { path: join(sessionDir, 'session.v4.jsonl.zstd') } };
    },
  };
  const cacheTable = {
    async delete(key) {
      calls.push(['cache', key]);
      return true;
    },
  };
  const ctx = {
    get(name) {
      if (name === 'workspaceRegistry') return registry;
      if (name === 'sessionPersistence') return persistence;
      if (name === 'storageDomain') return { get: () => ({ table: () => cacheTable }) };
      if (name === 'sessions') return { get: () => undefined };
      return undefined;
    },
    logger: { warn() {} },
  };

  // --check ничего не удаляет.
  const checked = await purgeArchivedSession(ctx, id, { check: true });
  assert.equal(checked.ok, true);
  assert.equal(checked.check, true);
  assert.deepEqual(checked.dirs, [sessionDir]);
  assert.equal(await readFile(join(sessionDir, 'session.v4.jsonl.zstd'), 'utf8'), 'log');

  // Обычное удаление.
  const result = await purgeArchivedSession(ctx, id);
  assert.equal(result.ok, true);
  assert.equal(result.filesRemoved, 1);
  assert.equal(result.cacheRemoved, true);
  assert.equal(result.archivedCleaned, true);
  assert.equal(result.workspacesCleaned, true);
  await assert.rejects(readFile(join(sessionDir, 'session.v4.jsonl.zstd')), /ENOENT/);
  await assert.rejects(readFile(join(cacheDir, `${id}.json`)), /ENOENT/);
  assert.deepEqual(calls, [
    ['cache', id],
    ['unarchive', id],
    ['detach', id],
  ]);

  // После удаления запись в архиве и проекте уже отсутствует: повторный вызов
  // идемпотентен.
  const again = await purgeArchivedSession(ctx, id);
  assert.equal(again.ok, true);
  assert.equal(again.alreadyGone, true);

  // Не архивная, но живые файлы — отказ.
  const otherDir = join(projectDir, other);
  await mkdir(otherDir, { recursive: true });
  const denied = await purgeArchivedSession(ctx, other);
  assert.equal(denied.ok, false);
  assert.equal(denied.code, 'not-archived');

  // Живая сессия — отказ.
  const liveCtx = {
    ...ctx,
    get(name) {
      if (name === 'sessions') return { get: () => ({}) };
      return ctx.get(name);
    },
  };
  registry.archivedSessionIds = [other];
  const live = await purgeArchivedSession(liveCtx, other);
  assert.equal(live.ok, false);
  assert.equal(live.code, 'live');

  // HTTP-маршрут: тот же код, но с JSON-ответом и без агента.
  await writeFile(join(otherDir, 'session.v4.jsonl.zstd'), 'log');
  registry.archivedSessionIds = [other];
  let registered;
  const routeScoped = {
    effect(callback) {
      callback();
      return () => {};
    },
    get(name) {
      if (name === 'connection') {
        return {
          fetch: {
            register(route) {
              registered = route;
              return () => {};
            },
          },
        };
      }
      return ctx.get(name);
    },
  };
  apply({
    effect(callback) {
      callback();
      return () => {};
    },
    commands: { register: () => () => {} },
    inject(deps, callback) {
      assert.deepEqual(deps, ['connection']);
      callback(routeScoped);
      return { dispose() {} };
    },
  });
  assert.ok(registered, 'маршрут не зарегистрирован');
  assert.equal(registered.path, '/api/session.purge');
  assert.deepEqual(registered.methods, ['POST']);

  const post = (sessionId) => registered.fetch(new Request('http://127.0.0.1/api/session.purge', {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ sessionId }),
  }));
  const response = await post(other);
  assert.equal(response.status, 200);
  assert.equal((await response.json()).ok, true);
  await assert.rejects(readFile(join(otherDir, 'session.v4.jsonl.zstd')), /ENOENT/);

  const repeated = await post(other);
  assert.equal(repeated.status, 200);
  assert.equal((await repeated.json()).alreadyGone, true);

  console.log('purge ok: проверка, удаление, идемпотентность, отказы, HTTP-маршрут');
} finally {
  process.env.DSH_HOME = previousHome;
  await rm(home, { recursive: true, force: true });
}
