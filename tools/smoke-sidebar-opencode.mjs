// Дымовой тест клиентской половины dsh-sidebar-opencode: выполняет модуль в
// подставном окружении (window/document/React), рендерит компонент списка и
// проверяет разметку строк. Ловит то, что не видит `node --check`: опечатки в
// путях рендера, упавший компонент, потерянные классы.
//
//   node tools/smoke-sidebar-opencode.mjs
import fs from 'node:fs';
import path from 'node:path';
import process from 'node:process';

const root = path.resolve(import.meta.dirname, '..');
const file = path.join(root, 'plugins/dsh-sidebar-opencode/client.js');
const code = fs.readFileSync(file, 'utf8');

let definition;
const alerts = [];
const window = {
  __ModuleLoader__: { load(entry) { definition = entry; } },
  localStorage: {
    getItem: (key) => (key === 'dsh.opencode.showArchived.v1' ? 'true' : null),
    setItem: () => {}
  },
  confirm: () => true,
  alert: (message) => alerts.push(message),
  setInterval: () => 0,
  clearInterval: () => {},
  AudioContext: undefined
};

function makeElement(tag) {
  return {
    tagName: tag,
    id: '',
    textContent: '',
    children: [],
    style: {},
    appendChild(child) { this.children.push(child); return child; },
    setAttribute() {},
    addEventListener() {},
    removeEventListener() {}
  };
}

const document = {
  title: 'DeepSeek Harness',
  head: makeElement('head'),
  body: makeElement('body'),
  getElementById: () => null,
  createElement: (tag) => makeElement(tag),
  addEventListener() {},
  removeEventListener() {}
};

// Минимальный React: хуки возвращают начальные значения, createElement
// собирает дерево, которого достаточно для проверок разметки.
const React = {
  createElement(type, props, ...children) {
    return { type, props: props || {}, children: children.flat(Infinity).filter((c) => c !== null && c !== undefined && c !== false) };
  },
  useState(initial) { return [initial, () => {}]; },
  useRef(initial) { return React.__refs.shift() || { current: initial }; },
  useEffect() {},
  Fragment: 'fragment',
  __refs: []
};

const requireStub = (name) => {
  if (name === 'react') return React;
  throw new Error('unknown module: ' + name);
};

const run = new Function('window', 'document', 'console', code);
run(window, document, console);
if (!definition) throw new Error('модуль не зарегистрировался через __ModuleLoader__');
if (definition.id !== '@local/dsh-sidebar-opencode') throw new Error('неожиданный id: ' + definition.id);

let captured = null;
const services = {
  sessions: {
    list: () => ({ ids: [], byId: {}, phase: 'ready' })
  },
  workspaces: {
    list: () => ({ items: [], archivedSessionIds: [] })
  },
  uiSession: {
    sessionStatus: () => new Map()
  }
};

const ctx = {
  get: (name) => services[name],
  remote: { commands: { execute: () => Promise.resolve({ ok: true }) } },
  slots: {
    inject(key, callback) {
      if (key !== 'sidebar.workspaces') throw new Error('неожиданный слот: ' + key);
      callback();
      return () => {};
    },
    register(options, component) { captured = { options, component }; return () => {}; }
  }
};

const exported = definition.factory(requireStub);
exported.apply(ctx);
if (!captured) throw new Error('компонент не зарегистрирован в слоте');

const sessionsState = {
  ids: ['s1', 's2', 's3', 's4'],
  phase: 'ready',
  byId: {
    s1: { id: 's1', title: 'Ждёт вопрос', updatedAt: Date.now() - 60000, running: true, retainedBy: { mainView: 0 } },
    s2: { id: 's2', title: 'Работает', updatedAt: Date.now() - 120000, running: true, retainedBy: { mainView: 1 } },
    s3: { id: 's3', title: 'Праздная', updatedAt: Date.now() - 3600000, running: false, retainedBy: { mainView: 0 } },
    s4: { id: 's4', title: 'Архивная', updatedAt: Date.now() - 7200000, running: false }
  }
};
const workspacesState = {
  items: [{ workspaceId: 'w1', title: 'Проект', path: 'C:/w1', sessionIds: ['s1', 's2', 's3', 's4'] }],
  archivedSessionIds: ['s4']
};
const statuses = new Map([
  ['s1', { running: true, pendingInteraction: { kind: 'question' }, completionUnread: false }],
  ['s2', { running: true, pendingInteraction: undefined, completionUnread: false }],
  ['s3', { running: false, pendingInteraction: undefined, completionUnread: false }],
  ['s4', { running: false, pendingInteraction: undefined, completionUnread: false }]
]);

const purgeCalls = [];
const props = {
  useSessions: () => sessionsState,
  useWorkspaces: () => workspacesState,
  useSessionStatus: () => statuses,
  open() {},
  startSession() {},
  archiveSession() {},
  unarchiveSession() {},
  pickDirectory: () => Promise.resolve(null),
  createWorkspace: () => Promise.resolve({}),
  deleteArchivedSession: (targetId) => {
    purgeCalls.push(targetId);
    return Promise.resolve({ ok: true });
  }
};

const tree = captured.component(props);
if (!tree) throw new Error('компонент ничего не вернул');

const flat = [];
(function walk(node) {
  if (!node || typeof node !== 'object') return;
  flat.push(node);
  (node.children || []).forEach(walk);
})(tree);

const classes = flat.map((node) => (node.props && node.props.className) || '').join(' ');
function expectClass(token, why) {
  if (!classes.includes(token)) throw new Error('не найдено: ' + token + ' (' + why + ')');
}
expectClass('dshoc-waiting', 'строка сессии, ждущей ответа, должна подсвечиваться');
expectClass('dshoc-wait', 'у ожидающей сессии должен быть зелёный маркер');
expectClass('dshoc-waitcount', 'проект должен показывать число ждущих сессий');
expectClass('dshoc-spin', 'работающая сессия должна по-прежнему показывать спиннер');

const waitingRow = flat.find((node) => node.props && String(node.props.className || '').includes('dshoc-waiting'));
if (!waitingRow) throw new Error('строка ожидания не найдена');
if (String(waitingRow.props.className).includes('dshoc-spin')) throw new Error('ожидание не должно рисоваться спиннером');
if (!String(waitingRow.props.title || '').includes('Ждёт')) throw new Error('title строки должен объяснять ожидание');

// У архивной строки есть корзина, и она вызывает удаление без открытой сессии.
const trash = flat.find((node) => node.props && String(node.props.className || '').includes('dshoc-danger'));
if (!trash) throw new Error('у архивной строки нет корзины удаления');
trash.props.onClick({ stopPropagation() {} });
await Promise.resolve();
if (purgeCalls.length !== 1 || purgeCalls[0] !== 's4') {
  throw new Error('корзина должна удалять архивную сессию s4: ' + JSON.stringify(purgeCalls));
}
if (alerts.length !== 0) throw new Error('удаление не должно просить открыть сессию: ' + alerts.join('; '));

console.log('smoke ok: строки, маркеры, подпись ожидания и удаление из архива на месте');
