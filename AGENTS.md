# AGENTS.md — контекст проекта DeepseekPlugins

Короткая инициализация для агента: что это за репозиторий, как он устроен, что
здесь можно менять и на что наступать не надо. Детали — в `docs/`.

## Что это

Единственный дом исходников кастомных плагинов DeepSeek Harness (DSH).
Репозиторий не привязан к рабочим проектам: плагины видны всем сессиям DSH
только потому, что профиль `desktop` держит на них ссылки.

- Плагин — npm-пакет с манифестом `dsh.bundle.patch` и (для UI) `dsh.client`.
- В профиль попадает как `"@local/<name>": "link:C:/projects/DeepseekPlugins/plugins/<name>"`
  плюс junction `~/.dsh/profiles/desktop/node_modules/@local/<name>`.
- `cordis.patch.yml` плагина вставляет строку в композицию; `index.js` —
  хост-половина (`export function apply(ctx)`), `client.js` — клиентская
  (`window.__ModuleLoader__.load({ id, factory })`).
- Само приложение лежит в `%LOCALAPPDATA%\Programs\DeepSeek Harness` и только
  читается: обновление DSH перезаписывает `resources`.

## Структура

```text
plugins/dsh-<name>/   исходники, один каталог = один пакет (@local/dsh-<name>)
archive/              снятые плагины; install.ps1 и plugin_manager их не видят
template/plugin/      скелет нового плагина
docs/                 PLUGIN-RULES.md, PLUGINS-GUIDE.md, BUILTIN-PLUGINS.md, recovery/
install.ps1           проверка/починка link, bundles, junction, pnpm-lock
README.md             каталог плагинов: обязательная строка на каждый плагин
```

## Состояние на 06.11.2026

DSH `0.2.2-rc.1`, профиль `desktop`, четыре плагина установлены и активны:

| Плагин | Версия | Строка | Половины |
|---|---|---|---|
| `@local/dsh-sidebar-opencode` | 0.10.2 | `sidebar-opencode` | клиент (слот `sidebar.workspaces`) |
| `@local/dsh-session-purge` | 1.1.0 | `session-purge` | хост (маршрут `POST api/session.purge` + команда `/delete-archived`) |
| `@local/dsh-model-provider-label` | 1.0.1 | `model-provider-label` | клиент (слот `conversation.input.model.label`) |
| `@local/dsh-changes-fold` | 1.0.0 | `changes-fold` | клиент (DOM-обвязка карточки `[data-changed-files]`) |

`archive/dsh-ru-locale` не ставить: в 0.2.2 русский встроен (8 языков), а
`ctx.locale.addLanguage({ id: 'ru' })` бросает `locale "ru" is already registered`.
Профили `web` и `headless` пустые — плагины туда не ставились.

## Правила

- Установка/снятие — только `plugin_manager` (`install_bundle`, `set_bundle`,
  `remove_bundle`). Не редактировать `~/.dsh/profiles/...` руками и не создавать
  пакеты в `~/.dsh`: профиль ведёт менеджер, ручные правки с ним расходятся.
- Один каталог = один пакет: `plugins/dsh-<name>`, имя `@local/dsh-<name>`,
  id строки `<name>`. Обязательный минимум файлов — в `docs/PLUGIN-RULES.md`.
- Новый плагин → строка в корневом `README.md` и в `docs/PLUGINS-GUIDE.md`;
  снятый — перенос в `archive/` и запись в `archive/README.md`.
- Перед установкой: `node --check client.js`; для переводимых — `node tools/build.mjs`.
- После установки читать `application`/`warnings`, проверять
  `plugin_manager list_plugins` (`fiberPhase: active`), затем обновить страницу
  DSH. Клиентскую половину из хоста не проверить — ошибка apply видна только
  в консоли браузера.
- Не переносить/переименовывать каталог плагина без `install.ps1 -Fix` — junction
  в профиле станет битым.
- Перед правкой профиля — бэкап в `docs/recovery/` (там уже лежат снимки).

## Подводные камни DSH 0.2.2

- Слоты `single`/`keyed` выбирают запись по `priority` (рендерится наименьший);
  `order` работает только у `list`. Регистрация `single` на уже занятом
  приоритете бросает `single slot "…" already has a registration … register at a
  different priority to shadow it`. Штатный `sidebar.workspaces` занят на `0`,
  поэтому плагин сайдбара сидит на `-1000`.
- `conversation.input.model.label` рендерит fallback, а не запись: регистрация
  на `-1` заменяет штатную подпись модели (без неё остаётся `model.name`).
- Локализация: базовые `zh`/`en` + `ja`, `es`, `fr`, `de`, `ru`, `pt`; свои
  словари регистрируются только для новых пространств имён/языков.
- Хост-контракты, на которые опираются плагины: `commands.register`
  (`{ name, description, input: { hint }, handler({ rawInput, agent }) }` →
  `{ kind: 'success' | 'error', text }`), `workspaceRegistry`
  (`archivedSessionIds`, `list()`, `unarchiveSession`, `workspace.detachSession`),
  `sessionPersistence.root`, `sessions.get(id)`, а также
  `connection.fetch.register({ path: '/api/…', methods, requestBody, fetch })` —
  аутентифицированный маршрут на `/api`-мосте, браузер зовёт его
  документно-относительным `fetch('api/…')` и получает cookie автоматически.
- Клиентские контракты: `sessions.list`, `workspaces.list`,
  `uiSession.sessionStatus` (Map `sessionId → { running, pendingInteraction,
  completionUnread }`), `uiWorkspace.openSession/startSession/archiveSession/
  unarchiveSession/pickDirectory`, `remote.commands.execute(receiverId, line, [])`.
- Снимки рабочей сессии: `sessions` — `{ ids, byId, phase }` (поля `blank`,
  `origin`, `updatedAt`), `workspaces` — `{ items: [{ workspaceId, title,
  sessionIds, … }], archivedSessionIds }`.
- Карточку изменённых файлов рисует `@deepseek-ai/dsh-client-ui-deliverables`
  внутри `list`-слота `conversation.chat.turnTail`; у неё нет конфига и нет
  своего слота, поэтому менять её поведение приходится DOM-обвязкой по
  стабильному атрибуту `data-changed-files` (так делает `dsh-changes-fold`).

## Проверка

```powershell
C:/projects/DeepseekPlugins/install.ps1        # отчёт: link, bundles, junction, lock
C:/projects/DeepseekPlugins/install.ps1 -Fix   # привести в порядок
node --check plugins/<name>/client.js
```

Плюс `plugin_manager list_plugins` — строки `include:<id>` с `fiberPhase`.
После правок клиента — переустановка и обновление страницы DSH; при смене
клиентского модуля страница может потребовать полного перезапуска.

## Документы

- [docs/PLUGIN-RULES.md](docs/PLUGIN-RULES.md) — как писать, собирать, ставить, обновлять.
- [docs/PLUGINS-GUIDE.md](docs/PLUGINS-GUIDE.md) — что делает каждый плагин и что где стоит.
- [docs/BUILTIN-PLUGINS.md](docs/BUILTIN-PLUGINS.md) — как читать экран «Встроенные плагины».
- [docs/recovery/](docs/recovery/) — бэкапы профиля перед правками.
