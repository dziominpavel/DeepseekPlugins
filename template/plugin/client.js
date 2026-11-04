// Клиентская половина: исполняется в браузере, регистрируется через __ModuleLoader__.
// id обязан совпадать с именем пакета в package.json.
window.__ModuleLoader__.load({
  id: '@local/dsh-plugin-template',
  factory(require) {
    const React = require('react');
    const h = React.createElement;

    function Badge() {
      return h('div', {
        style: { fontSize: 12, opacity: 0.7, padding: '2px 8px' },
      }, 'dsh plugin template');
    }

    return {
      inject: ['slots'],
      apply(ctx) {
        // Слот и его props проверяются через cordis_inspect_query, а не угадываются.
        ctx.slots.inject('conversation.composer.dock', () => ctx.slots.register({
          name: 'conversation.composer.dock',
          id: 'plugin-template',
          order: 5,
        }, Badge));
      },
    };
  },
});
