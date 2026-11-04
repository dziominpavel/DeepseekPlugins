# Правила плагинов DSH

Один набор правил для всех проектов. Плагин — это пакет с манифестом
`dsh.bundle.patch`, который ставится в профиль DSH ссылкой.

## 1. Где что лежит

| Что | Где | Почему |
|---|---|---|
| Исходники плагина | `C:/projects/dsh/plugins/<name>/` | одно место, git, не теряется при сносе приложения и проектов |
| Шаблон | `C:/projects/dsh/template/plugin/` | одинаковый скелет у всех плагинов |
| Состояние профиля | `~/.dsh/profiles/<profile>/package.json` и `cordis.patch.yml` | глобально, не в проекте |
| Само приложение | `%LOCALAPPDATA%/Programs/DeepSeek Harness/` | только для чтения: обновление заменяет `resources` |

**Нельзя** класть плагины в `resources/app.asar` (упакованный архив), в
`app.asar.unpacked` (перезаписывается обновлением), в каталог проекта и в
`~/.dsh` (профиль ведёт `plugin_manager`, ручные пакеты там расходятся с ним).

## 2. Имена и структура

- Каталог: `plugins/dsh-<name>`; имя пакета: `@local/dsh-<name>`; kebab-case.
- id строки в `cordis.patch.yml` = `<name>` без префикса `dsh-`.
- Обязательный минимум:

```text
package.json        name, private, type: module, exports, files, dsh.bundle + dsh.client
cordis.patch.yml    - insert: [{ id, name }]
index.js            хостовая половина, export function apply() {}
client.js           клиентская половина: window.__ModuleLoader__.load({...})
locale/en.json      meta.title / meta.description
locale/ru.json      то же по-русски
icon.svg            иконка для списка плагинов
README.md           что делает, как собрать, как включить
```

- `dsh.client.inject` перечисляет клиентские пакеты DSH, от которых зависит плагин.
- Точки расширения и слоты проверяются через `cordis_inspect_query`, а не угадываются.

## 3. Сборка и проверка

1. `node --check client.js` — синтаксис.
2. Для переводимых плагинов — `node tools/build.mjs` (без `--write` это проверка
   паритета ключей и плейсхолдеров, с `--write` — пересборка `client.js`).
3. Перед установкой прочитать манифест: `dsh.bundle.patch` указывает на существующий файл,
   `files` содержит всё, что импортируется.

## 4. Установка

```text
plugin_manager install_bundle target=C:/projects/dsh/plugins/dsh-<name>
```

Установка идёт **в текущий профиль**; менеджер не меняет другой профиль. Профили
`desktop`, `web`, `headless` — отдельные, при необходимости ставим в каждый.

После установки результат читается по `application`/`warnings`, а не по логам.

## 5. Обновление и переезд

- Правка `client.js` -> переустановка + перезапуск DSH (новое поколение JS-модулей).
- Перенос/переименование каталога -> junction в профиле битый; лечится
  `C:/projects/dsh/install.ps1 -Fix`, затем перезапуск.
- Смена версии -> поднять `version` в `package.json`, переустановить.

## 6. Проверка после установки

```powershell
C:/projects/dsh/install.ps1            # только проверка
C:/projects/dsh/install.ps1 -Fix       # починить манифест, lock и junction
```

Скрипт сверяет для каждого профиля: зависимость `link:` в `package.json`,
наличие пакета в `dsh.profile.bundles`, цель junction, записи в `pnpm-lock.yaml`.
