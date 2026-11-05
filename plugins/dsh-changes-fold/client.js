/**
 * dsh-changes-fold — сворачивает карточку изменённых файлов под ответом.
 *
 * Карточку рисует `@deepseek-ai/dsh-client-ui-deliverables`: корень помечен
 * `data-changed-files`, ниже заголовка идёт `ul` со списком файлов. Своего
 * конфига у карточки нет, а слот `conversation.chat.turnTail` — list, его запись
 * приоритетом не перекрыть. Поэтому плагин ничего не подменяет: он помечает
 * карточку и прячет список стилями, а между заголовком и списком вставляет
 * свою строку-переключатель.
 *
 * Список файлов рендерит React, и по умолчанию он режет длинный список сам
 * (первые 4 строки + своя кнопка «Все файлы N»). При раскрытии плагин один раз
 * нажимает эту кнопку, чтобы React отрисовал все строки; дальше видимостью
 * управляет только атрибут карточки.
 */
window.__ModuleLoader__.load({
  id: '@local/dsh-changes-fold',
  factory: function (require) {
    'use strict';

    var NS = 'changes-fold';
    var STYLE_ID = 'dsh-changes-fold-style';
    var OPEN = 'data-dsh-fold-open';
    var BUTTON = 'data-dsh-fold-toggle';

    var DICT = {
      en: {
        show: 'Show files',
        hide: 'Collapse',
        showAria: 'Show the changed files of this turn',
        hideAria: 'Collapse the changed files of this turn',
      },
      ru: {
        show: 'Показать файлы',
        hide: 'Свернуть',
        showAria: 'Показать изменённые файлы этого хода',
        hideAria: 'Свернуть изменённые файлы этого хода',
      },
    };

    var CSS = [
      // Карточка по умолчанию свёрнута: виден только заголовок и наша строка.
      '[data-changed-files]:not([' + OPEN + ']) > ul { display: none !important; }',
      // Штатная кнопка «Все файлы N» не нужна: её роль играет наша строка.
      '[data-changed-files] > button[aria-expanded]:not([' + BUTTON + ']) { display: none !important; }',
      '[data-changed-files] > [' + BUTTON + '] {',
      '  box-sizing: border-box; display: flex; align-items: center; gap: 6px;',
      '  width: 100%; min-width: 0; margin: 0; padding: 8px 18px 8px 14px;',
      '  border: 0; border-top: .5px solid var(--dsw-alias-border-l2);',
      '  background: transparent; color: var(--dsw-alias-label-tertiary);',
      '  font: inherit; font-size: 12px; line-height: 18px; text-align: left;',
      '  cursor: pointer;',
      '}',
      '[data-changed-files] > [' + BUTTON + ']:hover {',
      '  background: var(--dsw-alias-interactive-bg-hover);',
      '  color: var(--dsw-alias-label-secondary);',
      '}',
      '[data-changed-files] > [' + BUTTON + ']:focus-visible {',
      '  outline: none;',
      '  box-shadow: inset 0 0 0 2px var(--dsw-focus-ring-color, var(--dsw-alias-state-business-primary));',
      '}',
      '[data-changed-files] > [' + BUTTON + '] svg { flex: none; width: 14px; height: 14px; transition: transform .12s; }',
      '[data-changed-files] > [' + BUTTON + '][data-open] svg { transform: rotate(180deg); }',
    ].join('\n');

    function ensureStyle() {
      if (document.getElementById(STYLE_ID) !== null) return;
      var style = document.createElement('style');
      style.id = STYLE_ID;
      style.textContent = CSS;
      (document.head || document.documentElement).appendChild(style);
    }

    function chevron() {
      var svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
      svg.setAttribute('viewBox', '0 0 14 14');
      svg.setAttribute('aria-hidden', 'true');
      var path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
      path.setAttribute('d', 'M3.5 5.25 7 8.75l3.5-3.5');
      path.setAttribute('fill', 'none');
      path.setAttribute('stroke', 'currentColor');
      path.setAttribute('stroke-width', '1.5');
      path.setAttribute('stroke-linecap', 'round');
      path.setAttribute('stroke-linejoin', 'round');
      svg.appendChild(path);
      return svg;
    }

    function apply(ctx) {
      ensureStyle();

      var locale = ctx.locale;
      var t = locale.bind(NS);

      ctx.effect(function () {
        return locale.register(NS, DICT);
      }, 'changes-fold: dictionaries');

      function update(card) {
        var button = card.querySelector(':scope > [' + BUTTON + ']');
        if (button === null) return;
        var open = card.hasAttribute(OPEN);
        var text = open ? t('hide') : t('show');
        var label = button.querySelector('[data-dsh-fold-text]');
        if (label !== null && label.textContent !== text) label.textContent = text;
        button.setAttribute('aria-label', open ? t('hideAria') : t('showAria'));
        button.setAttribute('aria-expanded', open ? 'true' : 'false');
        if (open) button.setAttribute('data-open', '');
        else button.removeAttribute('data-open');
      }

      function setOpen(card, value) {
        if (value) card.setAttribute(OPEN, '');
        else card.removeAttribute(OPEN);
        if (value) {
          var native = card.querySelector(':scope > button[aria-expanded]:not([' + BUTTON + '])');
          if (native !== null && native.getAttribute('aria-expanded') === 'false') native.click();
        }
        update(card);
      }

      function decorate(card) {
        var list = card.querySelector(':scope > ul');
        if (list === null) return; // одиночный файл — сворачивать нечего
        var button = card.querySelector(':scope > [' + BUTTON + ']');
        if (button === null) {
          button = document.createElement('button');
          button.type = 'button';
          button.setAttribute(BUTTON, '');
          button.appendChild(chevron());
          var label = document.createElement('span');
          label.setAttribute('data-dsh-fold-text', '');
          button.appendChild(label);
          button.addEventListener('click', function (event) {
            event.preventDefault();
            event.stopPropagation();
            setOpen(card, !card.hasAttribute(OPEN));
          });
          card.insertBefore(button, list);
        }
        update(card);
      }

      function scan() {
        try {
          var cards = document.querySelectorAll('[data-changed-files]');
          for (var i = 0; i < cards.length; i += 1) decorate(cards[i]);
        } catch (error) {
          // Сломанная разметка не должна ронять чат.
          console.warn('changes-fold:', error);
        }
      }

      var scheduled = false;
      function schedule() {
        if (scheduled) return;
        scheduled = true;
        queueMicrotask(function () {
          scheduled = false;
          scan();
        });
      }

      ctx.effect(function () {
        var observer = new MutationObserver(schedule);
        observer.observe(document.documentElement, { childList: true, subtree: true });
        schedule();
        return function () {
          observer.disconnect();
        };
      }, 'changes-fold: observe chat');

      ctx.effect(function () {
        return locale.subscribe(function () {
          t = locale.bind(NS);
          scan();
        });
      }, 'changes-fold: labels');
    }

    return { inject: ['locale'], apply: apply };
  },
});
