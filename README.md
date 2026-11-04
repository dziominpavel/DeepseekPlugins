# dsh — плагины DeepSeek Harness

Единственное место, где живут исходники плагинов DSH. Не привязано ни к одному
проекту: CarMusicMeter и любой другой проект видят их только через профиль.

```text
C:\projects\DeepseekPlugins\
  plugins\            исходники плагинов, один каталог = один пакет
  template\plugin\    скелет нового UI-плагина
  docs\PLUGIN-RULES.md  правила: как писать, собирать, ставить, обновлять
  install.ps1         проверка и восстановление связи профиля с плагинами
```

## Сейчас здесь

| Плагин | Что делает |
|---|---|
| `dsh-ru-locale` | Русский язык веб-интерфейса DSH: 58 пространств имён, 2668 строк |
| `dsh-sidebar-opencode` | Список проектов и сессий в стиле opencode: ручной порядок, статусы, звук готовности |
| `dsh-model-provider-label` | Провайдер рядом с моделью в меню выбора модели |

## Как это связано с профилем

DSH ставит плагин в профиль ссылкой: `package.json` профиля хранит
`"@local/<name>": "link:C:/projects/DeepseekPlugins/plugins/<name>"`, а
`node_modules/@local/<name>` — junction на тот же каталог. Каталог можно
переносить только вместе с переустановкой, иначе junction станет битым.

```text
C:\Users\Dziom\.dsh\profiles\<profile>\package.json
C:\Users\Dziom\.dsh\profiles\<profile>\node_modules\@local\<name>  ->  C:\projects\DeepseekPlugins\plugins\<name>
```

## Новый плагин

1. `template/plugin` -> `plugins/dsh-<name>`, переименовать пакет в `@local/dsh-<name>`.
2. Собрать и проверить: `node --check client.js`, для переводов — `node tools/build.mjs`.
3. Поставить в профиль: `plugin_manager install_bundle target=C:/projects/DeepseekPlugins/plugins/dsh-<name>`.
4. После правок, переезда или смены диска — `install.ps1 -Fix`, затем перезапуск DSH.

Полные правила — [docs/PLUGIN-RULES.md](docs/PLUGIN-RULES.md).
