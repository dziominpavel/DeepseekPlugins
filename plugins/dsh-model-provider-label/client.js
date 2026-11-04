/**
 * dsh-model-provider-label — провайдер рядом с названием модели.
 *
 * Слот `conversation.input.model.label` (владелец — ui-model-selection) вызывается
 * в трёх местах: кнопка композера (`trigger`), строка «Модель» в корневом меню
 * (`menu`) и каждая строка списка моделей (`option`). Провайдера добавляем только
 * в `menu`: строки списка и так сгруппированы заголовками провайдеров, а кнопка
 * композера ограничена по ширине и сворачивается в иконку.
 *
 * Слот `single`, и встроенный `ui-deepseek-model-label-1017` уже занимает его на
 * приоритете 0. Поэтому регистрируемся на -1: у single-слота рендерится запись с
 * наименьшим приоритетом, а одинаковый приоритет был бы ошибкой регистрации.
 */
window.__ModuleLoader__.load({
  id: '@local/dsh-model-provider-label',
  factory(require) {
    const React = require('react');
    const h = React.createElement;

    /** Имя из каталога; пустая строка, если его нет. */
    function nameOf(value) {
      return value && typeof value.name === 'string' ? value.name : '';
    }

    function ModelProviderLabel(props) {
      const model = nameOf(props.model);
      const provider = nameOf(props.provider);

      if (props.placement !== 'menu' || provider === '') return h('span', null, model);

      return h('span', { 'data-model-provider-label': '' },
        h('span', { key: 'model' }, model),
        h('span', {
          key: 'provider',
          style: { color: 'var(--dsw-alias-label-secondary)' },
        }, ' · ' + provider));
    }

    return {
      inject: ['slots'],
      apply(ctx) {
        ctx.slots.inject('conversation.input.model.label', () => ctx.slots.register({
          name: 'conversation.input.model.label',
          priority: -1,
        }, ModelProviderLabel));
      },
    };
  },
});
