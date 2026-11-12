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
    getItem: (key) => {
      if (key === 'dsh.opencode.showArchived.v1') return 'true';
      if (key === 'dsh.opencode.alert.v1') return 'false';
      return null;
    },
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

// Минимальный React с настоящими хуками: useState перерисовывает дерево,
// useRef переживает перерисовку. useEffect не нужен — тест проверяет разметку.
let hookCursor = 0;
const hooks = [];
const React = {
  createElement(type, props, ...children) {
    return { type, props: props || {}, children: children.flat(Infinity).filter((c) => c !== null && c !== undefined && c !== false) };
  },
  useState(initial) {
    const index = hookCursor++;
    if (!(index in hooks)) hooks[index] = typeof initial === 'function' ? initial() : initial;
    const set = (next) => {
      hooks[index] = typeof next === 'function' ? next(hooks[index]) : next;
      render();
    };
    return [hooks[index], set];
  },
  useRef(initial) {
    const index = hookCursor++;
    if (!(index in hooks)) hooks[index] = { current: initial };
    return hooks[index];
  },
  useEffect() {},
  Fragment: 'fragment'
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
  ids: ['s1', 's2', 's3', 's4', 's5', 's6'],
  phase: 'ready',
  byId: {
    s1: { id: 's1', title: 'Ждёт вопрос', updatedAt: Date.now() - 60000, running: true, retainedBy: { mainView: 0 } },
    s2: { id: 's2', title: 'Работает', updatedAt: Date.now() - 120000, running: true, retainedBy: { mainView: 1 } },
    s3: { id: 's3', title: 'Праздная', updatedAt: Date.now() - 3600000, running: false, retainedBy: { mainView: 0 } },
    s4: { id: 's4', title: 'Архивная', updatedAt: Date.now() - 7200000, running: false },
    s5: { id: 's5', title: 'Архивная 2', updatedAt: Date.now() - 9000000, running: false },
    s6: { id: 's6', title: 'Текущая архивная', updatedAt: Date.now() - 300000, running: false, retainedBy: { mainView: 1 } }
  }
};
const workspacesState = {
  items: [{ workspaceId: 'w1', title: 'Проект', path: 'C:/w1', sessionIds: ['s1', 's2', 's3', 's4', 's5', 's6'] }],
  archivedSessionIds: ['s4', 's5', 's6', 'session-00000000-0000-4000-8000-000000000000']
};
const statuses = new Map([
  ['s1', { running: true, pendingInteraction: { kind: 'question' }, completionUnread: false }],
  ['s2', { running: true, pendingInteraction: undefined, completionUnread: false }],
  ['s3', { running: false, pendingInteraction: undefined, completionUnread: false }],
  ['s4', { running: false, pendingInteraction: undefined, completionUnread: false }],
  ['s5', { running: false, pendingInteraction: undefined, completionUnread: false }],
  ['s6', { running: false, pendingInteraction: undefined, completionUnread: false }]
]);

const purgeCalls = [];
const batchCalls = [];
const props = {
  useSessions: () => sessionsState,
  useWorkspaces: () => workspacesState,
  useSessionStatus: () => statuses,
  open() {},
  startSession() {},
  archiveSession() {},
  unarchiveSession() {},
  deleteArchivedSession: (targetId) => {
    purgeCalls.push(targetId);
    return Promise.resolve({ ok: true });
  },
  deleteArchivedSessions: (targetIds) => {
    batchCalls.push(targetIds.slice());
    return Promise.resolve({
      ok: true,
      batch: true,
      total: targetIds.length,
      deleted: targetIds.length,
      failed: 0,
      results: targetIds.map((id) => ({ sessionId: id, ok: true }))
    });
  }
};

let currentTree = null;
function render() {
  hookCursor = 0;
  currentTree = captured.component(props);
  return currentTree;
}
function flatten(root) {
  const out = [];
  (function walk(node) {
    if (!node || typeof node !== 'object') return;
    out.push(node);
    (node.children || []).forEach(walk);
  })(root);
  return out;
}
function textOf(node) {
  return (node.children || []).filter((child) => typeof child === 'string').join('');
}
function allText(node) {
  if (typeof node === 'string') return node;
  if (!node || typeof node !== 'object') return '';
  return (node.children || []).map(allText).join('');
}

let tree = render();
if (!tree) throw new Error('компонент ничего не вернул');
const flat = flatten(tree);

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
const trash = flat.find((node) => {
  const tokens = String((node.props && node.props.className) || '').split(/\s+/);
  return tokens.includes('dshoc-danger');
});
if (!trash) throw new Error('у архивной строки нет корзины удаления');
trash.props.onClick({ stopPropagation() {} });
await Promise.resolve();
if (purgeCalls.length !== 1 || purgeCalls[0] !== 's4') {
  throw new Error('корзина должна удалять архивную сессию s4: ' + JSON.stringify(purgeCalls));
}
if (alerts.length !== 0) throw new Error('удаление не должно просить открыть сессию: ' + alerts.join('; '));

// Панель настроек: открывается шестерёнкой и закрывается только ею.
if (code.includes("document.addEventListener('mousedown'")) {
  throw new Error('панель не должна закрываться по клику вне неё');
}
let gear = flat.find((node) => node.props && node.props.title === 'Настройки списка');
if (!gear) throw new Error('шестерёнка настроек не найдена');
gear.props.onClick();

let panelFlat = flatten(currentTree);
const panel = panelFlat.find((node) => String((node.props && node.props.className) || '').includes('dshoc-panel'));
if (!panel) throw new Error('панель настроек не открылась');
if (panel.props.id !== 'dshoc-settings-panel') throw new Error('у панели нет id для aria-controls');

const openGear = panelFlat.find((node) => node.props && node.props.title === 'Закрыть настройки списка');
if (!openGear) throw new Error('шестерёнка не переключилась в режим закрытия');
if (openGear.props['aria-expanded'] !== 'true') throw new Error('aria-expanded не сообщает об открытой панели');

const groupTitles = panelFlat
  .filter((node) => String((node.props && node.props.className) || '').includes('dshoc-grouptitle'))
  .map(textOf);
if (groupTitles.join('|') !== 'Список|Архив|Уведомления') {
  throw new Error('ожидались группы «Список», «Архив» и «Уведомления»: ' + groupTitles.join('|'));
}

const testIcons = panelFlat.filter((node) => String((node.props && node.props.className) || '').includes('dshoc-testicon'));
if (testIcons.length !== 2) throw new Error('должно быть ровно две кнопки проверки звука, а не ' + testIcons.length);
if (testIcons[0].props.disabled) throw new Error('проверка готовности должна работать при включённом звуке');
if (!testIcons[1].props.disabled) throw new Error('проверка ожидания должна быть недоступна при выключенном звуке');

const repeat = panelFlat.find((node) => String((node.props && node.props.className) || '').includes('dshoc-subcheck'));
const repeatInput = repeat && (repeat.children || []).find((child) => child && child.type === 'input');
if (!repeatInput || repeatInput.props.disabled !== true) {
  throw new Error('«Повторять напоминание» должно быть недоступно без звука ожидания');
}

const oldTestButtons = panelFlat.filter((node) => node.type === 'span' && ['Готовность', 'Ждёт ответа'].includes(textOf(node)));
if (oldTestButtons.length > 0) throw new Error('старые кнопки «Готовность»/«Ждёт ответа» остались в панели');
if (panelFlat.some((node) => String((node.props && node.props.className) || '').includes('dshoc-diag'))) {
  throw new Error('техническая диагностика не должна висеть в настройках');
}

const danger = panelFlat.find((node) => {
  const tokens = String((node.props && node.props.className) || '').split(/\s+/);
  return tokens.includes('dshoc-dangerbtn');
});
if (!danger) throw new Error('в настройках нет кнопки удаления архива');
if (danger.props.disabled) throw new Error('кнопка удаления архива должна быть доступна при архивных сессиях');
if (!allText(danger).includes('(2)')) throw new Error('на кнопке удаления нет счётчика архива: ' + allText(danger));

danger.props.onClick();
await new Promise((resolve) => setTimeout(resolve, 0));
if (purgeCalls.length !== 3 || purgeCalls[1] !== 's5' || purgeCalls[2] !== 's6') {
  throw new Error('кнопка удаления должна вызвать одиночное удаление для каждой архивной сессии: ' + JSON.stringify(purgeCalls));
}
panelFlat = flatten(currentTree);
const purgeStatus = panelFlat.find((node) => {
  const tokens = String((node.props && node.props.className) || '').split(/\s+/);
  return tokens.includes('dshoc-status');
});
if (!purgeStatus || !allText(purgeStatus).includes('Удалено 2')) {
  throw new Error('после пакетного удаления нет статуса «Удалено 2»: ' + (purgeStatus ? allText(purgeStatus) : 'нет'));
}
const dangerAfter = panelFlat.find((node) => {
  const tokens = String((node.props && node.props.className) || '').split(/\s+/);
  return tokens.includes('dshoc-dangerbtn');
});
if (!dangerAfter || dangerAfter.props.disabled !== true) {
  throw new Error('после удаления архива кнопка должна стать недоступной');
}

openGear.props.onClick();
if (flatten(currentTree).some((node) => String((node.props && node.props.className) || '').includes('dshoc-panel'))) {
  throw new Error('повторное нажатие шестерёнки не закрыло панель');
}

function hasClass(node, token) {
  return String((node.props && node.props.className) || '').split(/\s+/).includes(token);
}
function findCheckbox(labelText) {
  const label = flatten(currentTree).find((node) => node.type === 'label' && allText(node).includes(labelText));
  return label && (label.children || []).find((child) => child && child.type === 'input');
}
function projectTitles() {
  return flatten(currentTree).filter((node) => hasClass(node, 'dshoc-title')).map(textOf);
}
function treeText() {
  return allText(currentTree);
}
function openSettings() {
  const gear = flatten(currentTree).find((node) => node.props && node.props.title === 'Настройки списка');
  if (!gear) throw new Error('шестерёнка настроек не найдена');
  gear.props.onClick();
}
function closeSettings() {
  const gear = flatten(currentTree).find((node) => node.props && node.props.title === 'Закрыть настройки списка');
  if (!gear) throw new Error('панель настроек не открыта');
  gear.props.onClick();
}

// --- Видимость проектов: пустые и архивные ---
// w2 — только архив, w3 — вообще без сессий, w4 — только чужой blank,
// w5 — текущий открытый черновик. w1 остаётся с обычными сессиями.
const later = Date.now();
sessionsState.ids.push('s9', 's7', 's8');
sessionsState.byId.s9 = { id: 's9', title: 'Архивная в пустом', updatedAt: later - 1000, running: false, retainedBy: { mainView: 0 } };
sessionsState.byId.s7 = { id: 's7', title: 'Черновик не текущий', updatedAt: later - 2000, running: false, blank: true, retainedBy: { mainView: 0 } };
sessionsState.byId.s8 = { id: 's8', title: '', updatedAt: later - 3000, running: false, blank: true, retainedBy: { mainView: 1 } };
workspacesState.items.push(
  { workspaceId: 'w2', title: 'Только архив', path: 'C:/w2', sessionIds: ['s9'] },
  { workspaceId: 'w3', title: 'Пустой проект', path: 'C:/w3', sessionIds: [] },
  { workspaceId: 'w4', title: 'Только черновик', path: 'C:/w4', sessionIds: ['s7'] },
  { workspaceId: 'w5', title: 'Текущий черновик', path: 'C:/w5', sessionIds: ['s8'] }
);
workspacesState.archivedSessionIds.push('s9');
render();

openSettings();
const archiveCheckbox = findCheckbox('Показывать архивные');
if (!archiveCheckbox || archiveCheckbox.props.checked !== true) {
  throw new Error('галочка «Показывать архивные» должна быть включена из localStorage');
}
archiveCheckbox.props.onChange();
closeSettings();

if (projectTitles().join('|') !== 'Проект|Текущий черновик') {
  throw new Error('при выключенном архиве должны остаться только проекты с видимыми сессиями: ' + projectTitles().join('|'));
}
if (treeText().includes('Только архив') || treeText().includes('Пустой проект') || treeText().includes('Только черновик')) {
  throw new Error('проект без видимых сессий не должен рисоваться');
}
const blankRow = flatten(currentTree).find((node) => hasClass(node, 'dshoc-blank'));
if (!blankRow) throw new Error('текущий пустой черновик должен быть строкой «Новая сессия»');
if (!hasClass(blankRow, 'dshoc-current')) throw new Error('строка нового черновика должна быть текущей');
if (!allText(blankRow).includes('Новая сессия')) throw new Error('у пустого черновика нет подписи «Новая сессия»');
if (blankRow.props.draggable === true) throw new Error('новый черновик нельзя перетаскивать');

const blankGroup = flatten(currentTree).find((node) => hasClass(node, 'dshoc-ws') && allText(node).includes('Текущий черновик'));
const blankCount = blankGroup && (blankGroup.children || []).find((child) => hasClass(child, 'dshoc-count'));
if (!blankCount || textOf(blankCount) !== '1') {
  throw new Error('проект с текущим черновиком должен показывать счётчик 1: ' + (blankCount ? textOf(blankCount) : 'нет'));
}

openSettings();
const showArchivedAgain = findCheckbox('Показывать архивные');
if (!showArchivedAgain || showArchivedAgain.props.checked !== false) {
  throw new Error('галочка «Показывать архивные» не выключилась');
}
showArchivedAgain.props.onChange();
closeSettings();

if (projectTitles().join('|') !== 'Проект|Только архив|Текущий черновик') {
  throw new Error('при включённом архиве проект с архивной сессией должен вернуться: ' + projectTitles().join('|'));
}
if (!treeText().includes('Архивная в пустом')) throw new Error('архивная строка не появилась при включённой галочке');
const archivedRow = flatten(currentTree).find((node) => hasClass(node, 'dshoc-row') && hasClass(node, 'dshoc-archived') && allText(node).includes('Архивная в пустом'));
if (!archivedRow) throw new Error('архивная строка должна быть помечена dshoc-archived');
if (treeText().includes('Пустой проект') || treeText().includes('Только черновик')) {
  throw new Error('проект без сессий и проект только с чужим blank не должны рисоваться даже с архивом');
}

// --- Пустой список: подсказка про скрытый архив и добавление проекта ---
openSettings();
const finalArchiveCheckbox = findCheckbox('Показывать архивные');
if (!finalArchiveCheckbox) throw new Error('галочка архива не найдена перед проверкой пустого списка');
if (finalArchiveCheckbox.props.checked === true) finalArchiveCheckbox.props.onChange();
closeSettings();

if (flatten(currentTree).some((node) => node.props && node.props.title === 'Добавить проект')) {
  throw new Error('кнопка «Добавить проект» должна быть убрана из шапки');
}

sessionsState.ids = [];
sessionsState.byId = {};
workspacesState.items = [];
workspacesState.archivedSessionIds = [];
render();
if (!treeText().includes('Нет проектов')) {
  throw new Error('без проектов список должен писать «Нет проектов»');
}
if (!treeText().includes('Добавить проект можно на экране новой сессии.')) {
  throw new Error('без кнопки добавления нужна подсказка, где добавить проект');
}
if (treeText().includes('В архиве есть сессии')) {
  throw new Error('без архивных сессий подсказка про архив не нужна');
}

workspacesState.items = [{ workspaceId: 'w3', title: 'Пустой проект', path: 'C:/w3', sessionIds: [] }];
render();
if (!treeText().includes('Нет проектов с сессиями')) {
  throw new Error('пустой список должен объяснять, что проектов с сессиями нет');
}
if (treeText().includes('В архиве есть сессии')) {
  throw new Error('без архивных сессий подсказка про архив не нужна');
}

sessionsState.ids = ['s9'];
sessionsState.byId = { s9: { id: 's9', title: 'Архивная в пустом', updatedAt: later, running: false } };
workspacesState.archivedSessionIds = ['s9'];
render();
if (!treeText().includes('Нет проектов с сессиями')) {
  throw new Error('проект без видимых сессий не должен оставлять пустой список без объяснения');
}
if (!treeText().includes('В архиве есть сессии')) {
  throw new Error('при скрытом архиве пустой список должен подсказывать про «Показывать архивные»');
}

console.log('smoke ok: строки, маркеры, ожидание, удаление архива, настройки, видимость пустых/архивных проектов, текущий черновик, пустой список, кнопка добавления убрана');
