# Tasks

## 1. Проверка платформы и каркас пакета

- [ ] 1.1 Проверить в изолированной пробе, что `agent/created` и `agent.ctx.systemPrompt.section` доступны в пресетах `standard`, `ptc`, `minimal`, `cordis` и при resume; зафиксировать выбранный путь (system-section или fallback `agent/pre-step`) в комментарии `index.js`; проверка — секция с тестовым текстом видна в новой сессии, fallback описан.
- [ ] 1.2 Создать `plugins/dsh-memory` с `package.json`, `cordis.patch.yml`, `locale/{ru,en}.json`, `icon.svg`, минимальным `index.js`; проверка — `node --check index.js`, `package.json.files` содержит `index.js`, `cordis.patch.yml`, `skills`, `locale/*.json`, `icon.svg`, `README.md`, JSON парсится.
- [ ] 1.3 Реализовать `Config` на schemastery и резолв `memoryDir` (`@deepseek-ai/dsh-home-paths`, иначе `DSH_HOME`, иначе `~/.dsh`), создание каталога; проверка — скрипт с временным `DSH_HOME` печатает ожидаемый путь и создаёт `MEMORY.md`/`USER.md`.
- [ ] 1.4 Реализовать модель стора: записи через `§`, лимиты, дедуп, atomic temp+rename, lock-файл; проверка — `node tools/test-memory.mjs` покрывает лимит, дубль, две конкурентные записи и отсутствие частичного файла.
- [ ] 1.5 Реализовать `audit.jsonl`, `.history/<target>/`, `undo` с перемещением использованной версии в `.history/undone/`; проверка — тесты: принятая/отклонённая запись в аудите, `historyLimit` удаляет старое, undo возвращает предыдущую версию.

## 2. Tool, безопасность, export/import

- [ ] 2.1 Реализовать tool `memory` (`defineTool`): `action`/`target`/`content`/`match`, `list` без агента, запись только с `exec.agent`; проверка — тесты на add/replace/remove/list, дубль, ноль/несколько совпадений, отсутствие агента у записи.
- [ ] 2.2 Реализовать скан (injection, role hijack, секреты, невидимые/bidi, fence escape) и подключить к записи; проверка — тесты по каждой категории: стор не меняется, ошибка называет причину, в аудите хеш вместо сырого секрета.
- [ ] 2.3 Реализовать export/import JSON (`format`, `version`, `stores`), merge/replace, лимит 256 КБ, валидацию и атомарность; проверка — round-trip, merge без дублей, replace, битый/небезопасный файл не меняет ни один стор.
- [ ] 2.4 Реализовать `/memory` (`list`, `show`, `log`, `undo`, `export`, `import`, `help`) через `ctx.commands.register`; проверка — каждая подкоманда возвращает ожидаемый текст, `list`/`export` работают без активного агента.

## 3. Инъекция, навык, внешние правки

- [ ] 3.1 Реализовать frozen-инъекцию на `agent/created`: system-section `agent-memory` (order 9000), fallback `agent/pre-step`; проверка — новая сессия видит факт, запись в середине сессии не меняет промпт, следующая сессия видит её, пустая память не добавляет блок, текст в fence.
- [ ] 3.2 Реализовать скан при чтении стора для инъекции; проверка — внешняя правка с injection/секретом не вставляется, сессия продолжается, предупреждение в логе и `/memory`; безопасная правка видна в следующей сессии.
- [ ] 3.3 Создать `skills/memory/SKILL.md` и регистрацию через `ctx.skills.register` (`source: 'memory'`, `path`, `resourceBase`); проверка — навык виден в каталоге, проектный навык с тем же именем перекрывает пакетный, без `ctx.skills` tool/инъекция работают.

## 4. Документация, упаковка, установка

- [ ] 4.1 Заполнить `plugins/dsh-memory/README.md`: что делает, установка, перенос, export/import, лимиты, безопасность, поведение при сбоях; проверка — все команды и пути из README выполняются как написано.
- [ ] 4.2 Обновить `README.md`, `docs/PLUGINS-GUIDE.md`, `AGENTS.md`: строка плагина, версия, строка композиции; проверка — имя `@local/dsh-memory`, id `memory`, версия совпадают с `package.json`.
- [ ] 4.3 Установить в профиль `desktop` через `plugin_manager install_bundle`; проверка — `application`/`warnings` без ошибок, `include:memory` в `fiberPhase: active`, новая сессия видит tool/команду/навык.
- [ ] 4.4 Выполнить `install.ps1` и `install.ps1 -Capture`; проверка — link/junction/bundles/lock чистые, снимок `profile/desktop` содержит `@local/dsh-memory`.
- [ ] 4.5 Проверить перенос данных: export во временный файл, import в другой `memoryDir` и новую сессию; проверка — оба стора совпадают, битый импорт отклонён без частичных изменений.

## 5. Интеграция и регрессии

- [ ] 5.1 Прогнать acceptance: add в сессии A → новая сессия B видит факт; запись в середине A не в промпте; скан блокирует injection/секрет; `/memory undo`; export/import; навык в каталоге; проверка — результаты записаны в README/комментарии change.
- [ ] 5.2 Проверить отказы: отсутствующий каталог, нечитаемый файл, композиция без `ctx.skills`, две конкурентные сессии, Windows rename; проверка — сессия не блокируется, ошибки понятны, стор не повреждён.
- [ ] 5.3 Проверить регрессии: `dsh-skillpack`, `dsh-session-purge`, `dsh-sidebar-opencode`, `dsh-changes-fold`, `dsh-model-provider-label` активны; `install.ps1` без ошибок; проверка — `plugin_manager list_plugins` и отчёт `install.ps1`.

## Workflow follow-up

- Archive the change after review and acceptance.
- Refresh the profile snapshot again if installation settings change before archive.
