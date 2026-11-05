# Плагины DeepSeek Harness

Исходники кастомных плагинов DSH. Один каталог в `plugins/` = один пакет.
Плагины не привязаны к рабочим проектам: DSH видит их только через профиль,
который держит ссылку `link:C:/projects/DeepseekPlugins/plugins/<name>`.

```text
plugins/            исходники плагинов, один каталог = один пакет
archive/            снятые плагины, не устанавливаются
template/plugin/    скелет нового плагина
docs/               правила, гайд по плагинам, разбор «Встроенных плагинов»
install.ps1         проверка и починка связи профиля с исходниками
AGENTS.md           контекст проекта для агентов
```

## Каталог плагинов

Обязательный индекс: **добавил плагин — добавил строку сюда** (и в
[docs/PLUGINS-GUIDE.md](docs/PLUGINS-GUIDE.md)). Описание — одной фразой, чтобы
по таблице было сразу понятно, что установлено и что оно делает.

| Плагин | Версия | Что делает |
|---|---|---|
| [dsh-sidebar-opencode](plugins/dsh-sidebar-opencode/README.md) | 0.10.2 | Левая колонка в стиле opencode: проекты и сессии, ручной порядок перетаскиванием, статусы, звук готовности и сигнал «сессия ждёт ответа», архив с удалением навсегда |
| [dsh-session-purge](plugins/dsh-session-purge/README.md) | 1.1.0 | Хост-маршрут `POST api/session.purge` и команда `/delete-archived`: безвозвратно удаляют архивную сессию — журнал, кэш проекций и запись в реестре |
| [dsh-model-provider-label](plugins/dsh-model-provider-label/README.md) | 1.0.1 | Провайдер рядом с названием модели в строке «Модель» меню композера |
| [dsh-changes-fold](plugins/dsh-changes-fold/README.md) | 1.0.0 | Держит карточку «Отредактированные файлы» свёрнутой до заголовка, список раскрывается по клику |

Все четыре подключены к профилю `desktop` и работают одновременно: занимают разные
слоты и не конфликтуют. Русский язык — не плагин: он встроен в DSH 0.2.2
(**Настройки → Общие → Язык**), а `dsh-ru-locale` снят в `archive/`.

## Поставить и проверить

```text
plugin_manager install_bundle target=C:/projects/DeepseekPlugins/plugins/dsh-<name>
```

После правки `client.js` или смены версии — переустановка и обновление страницы
DSH: клиентские модули подхватываются новым поколением.

```powershell
C:/projects/DeepseekPlugins/install.ps1        # отчёт: link, bundle, junction, lock
C:/projects/DeepseekPlugins/install.ps1 -Fix   # починить после переезда каталога
```

## Новый плагин

1. `template/plugin` → `plugins/dsh-<name>`, имя пакета `@local/dsh-<name>`.
2. Проверить: `node --check client.js` (для переводов — `node tools/build.mjs`).
3. Поставить в профиль через `plugin_manager install_bundle`.
4. **Дописать строку в таблицу выше** и в [docs/PLUGINS-GUIDE.md](docs/PLUGINS-GUIDE.md);
   снятый плагин — в `archive/` и с пометкой в [archive/README.md](archive/README.md).

Полные правила — [docs/PLUGIN-RULES.md](docs/PLUGIN-RULES.md).
