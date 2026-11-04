# Шаблон UI-плагина DSH

Скопируй каталог в `C:/projects/DeepseekPlugins/plugins/dsh-<name>/` и замени:

1. `package.json`: `name` -> `@local/dsh-<name>`, `description`, `inject`.
2. `cordis.patch.yml`: `id` -> `<name>`, `name` -> `@local/dsh-<name>`.
3. `client.js`: `id` в `__ModuleLoader__.load` и id слота.
4. `locale/en.json`, `locale/ru.json`: название и описание для списка плагинов.
5. `icon.svg`: своя иконка.

Проверка и установка:

```text
node --check client.js
plugin_manager install_bundle target=C:/projects/DeepseekPlugins/plugins/dsh-<name>
```
