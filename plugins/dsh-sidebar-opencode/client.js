/* dsh-sidebar-opencode — список сессий в стиле opencode для DeepSeek Harness. */
window.__ModuleLoader__.load({
  id: '@local/dsh-sidebar-opencode',
  factory: function (require) {
    'use strict';

    var React = require('react');
    var h = React.createElement;

    var NS = 'sidebar-opencode';
    var ORDER_KEY = 'dsh.opencode.order.v1';
    var EXPAND_KEY = 'dsh.opencode.expanded.v1';
    var SOUND_KEY = 'dsh.opencode.sound.v1';
    var ARCHIVED_KEY = 'dsh.opencode.showArchived.v1';
    var STYLE_ID = 'dsh-opencode-style';
    var SOUND_SRC = 'data:audio/wav;base64,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';
    var PALETTE = ['#e5484d', '#f76b15', '#f5b800', '#46a758', '#12a594', '#0091ff', '#6e56cf', '#d6409f', '#8e4ec6', '#3e63dd'];

    function readJson(key, fallback) {
      try {
        var raw = window.localStorage.getItem(key);
        if (!raw) return fallback;
        var value = JSON.parse(raw);
        return value === null || value === undefined ? fallback : value;
      } catch (error) {
        return fallback;
      }
    }

    function writeJson(key, value) {
      try {
        window.localStorage.setItem(key, JSON.stringify(value));
      } catch (error) {}
    }

    function colorFor(name) {
      var hash = 0;
      var text = String(name || '');
      for (var i = 0; i < text.length; i++) hash = (hash * 31 + text.charCodeAt(i)) >>> 0;
      return PALETTE[hash % PALETTE.length];
    }

    function initialFor(name) {
      var match = /[0-9A-Za-z\u0410-\u044f]/.exec(String(name || ''));
      return match ? match[0].toUpperCase() : '?';
    }

    function orderedIds(allIds, saved) {
      var seen = Object.create(null);
      var result = [];
      (saved || []).forEach(function (id) {
        if (allIds.indexOf(id) >= 0 && !seen[id]) { seen[id] = true; result.push(id); }
      });
      allIds.forEach(function (id) {
        if (!seen[id]) { seen[id] = true; result.push(id); }
      });
      return result;
    }

    function relativeTime(value, now) {
      if (!value) return '';
      var diff = Math.max(0, now - value);
      var minutes = Math.floor(diff / 60000);
      if (minutes < 1) return 'сейчас';
      if (minutes < 60) return minutes + ' мин';
      var hours = Math.floor(minutes / 60);
      if (hours < 24) return hours + ' ч';
      var days = Math.floor(hours / 24);
      if (days === 1) return 'вчера';
      if (days < 30) return days + ' дн';
      return new Date(value).toLocaleDateString('ru-RU');
    }

    function playChime(box, src) {
      try {
        if (!box.current) box.current = new Audio(src);
        box.current.currentTime = 0;
        var played = box.current.play();
        if (played && played.catch) played.catch(function () {});
      } catch (error) {}
    }

    function svg(props, children) {
      var base = { viewBox: '0 0 24 24', width: 14, height: 14, fill: 'none', stroke: 'currentColor', 'stroke-width': 2, 'stroke-linecap': 'round', 'stroke-linejoin': 'round' };
      var merged = Object.assign({}, base, props);
      return h.apply(null, ['svg', merged].concat(children));
    }

    function iconSound(on) {
      var parts = [h('path', { key: 'sp', d: 'M11 5 6 9H3v6h3l5 4V5z' })];
      if (on) {
        parts.push(h('path', { key: 'w1', d: 'M15.5 8.5a5 5 0 0 1 0 7' }));
        parts.push(h('path', { key: 'w2', d: 'M18.5 5.5a9 9 0 0 1 0 13' }));
      } else {
        parts.push(h('line', { key: 'sl', x1: 3, y1: 3, x2: 21, y2: 21 }));
      }
      return svg({}, parts);
    }

    function iconArchive() {
      return svg({}, [
        h('rect', { key: 'top', x: 3, y: 4, width: 18, height: 4, rx: 1 }),
        h('path', { key: 'body', d: 'M5 8v11a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V8' }),
        h('path', { key: 'line', d: 'M10 12h4' })
      ]);
    }

    function iconRestore() {
      return svg({}, [
        h('path', { key: 'body', d: 'M5 8v11a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V8' }),
        h('rect', { key: 'top', x: 3, y: 4, width: 18, height: 4, rx: 1 }),
        h('path', { key: 'arrow', d: 'M12 16v-6' }),
        h('path', { key: 'head', d: 'm9 13 3-3 3 3' })
      ]);
    }

    function ensureStyles() {
      if (typeof document === 'undefined' || document.getElementById(STYLE_ID)) return;
      var style = document.createElement('style');
      style.id = STYLE_ID;
      style.textContent = [
        '@keyframes dshoc-spin { to { transform: rotate(360deg); } }',
        '.dshoc-root { display: flex; flex-direction: column; gap: 1px; padding: 2px 6px 8px; min-height: 0; overflow: auto; }',
        '.dshoc-head { display: flex; align-items: center; justify-content: space-between; padding: 6px 6px 4px; font-size: 11px; letter-spacing: .04em; text-transform: uppercase; opacity: .55; }',
        '.dshoc-headactions { display: flex; align-items: center; gap: 2px; }',
        '.dshoc-iconbtn { border: 0; background: transparent; color: inherit; cursor: pointer; padding: 3px; border-radius: 4px; line-height: 0; opacity: 0; flex: 0 0 auto; }',
        '.dshoc-head .dshoc-iconbtn { opacity: .75; }',
        '.dshoc-iconbtn:hover { opacity: 1; background: rgba(127,127,127,.22); }',
        '.dshoc-iconbtn.dshoc-off { opacity: .35; }',
        '.dshoc-ws { display: flex; align-items: center; gap: 8px; padding: 4px 6px; border-radius: 6px; cursor: pointer; }',
        '.dshoc-ws:hover { background: rgba(127,127,127,.13); }',
        '.dshoc-chip { width: 18px; height: 18px; border-radius: 5px; display: flex; align-items: center; justify-content: center; font-size: 11px; font-weight: 600; color: #fff; flex: 0 0 auto; }',
        '.dshoc-title { flex: 1 1 auto; font-size: 13px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }',
        '.dshoc-add { opacity: 0; border: 0; background: transparent; color: inherit; cursor: pointer; font-size: 15px; line-height: 1; padding: 1px 5px; border-radius: 4px; }',
        '.dshoc-ws:hover .dshoc-add { opacity: .65; }',
        '.dshoc-add:hover { opacity: 1; background: rgba(127,127,127,.22); }',
        '.dshoc-sessions { display: flex; flex-direction: column; gap: 1px; padding: 1px 0 3px 4px; }',
        '.dshoc-row { display: flex; align-items: center; gap: 6px; padding: 4px 6px 4px 22px; border-radius: 6px; cursor: pointer; font-size: 12.5px; }',
        '.dshoc-row:hover { background: rgba(127,127,127,.13); }',
        '.dshoc-row:hover .dshoc-iconbtn { opacity: .55; }',
        '.dshoc-row.dshoc-archived .dshoc-name { opacity: .55; }',
        '.dshoc-name { flex: 1 1 auto; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }',
        '.dshoc-time { font-size: 11px; opacity: .45; flex: 0 0 auto; }',
        '.dshoc-dot { width: 8px; height: 8px; border-radius: 50%; flex: 0 0 auto; }',
        '.dshoc-spin { width: 10px; height: 10px; border-radius: 50%; border: 1.5px solid rgba(127,127,127,.35); border-top-color: #4aa3ff; animation: dshoc-spin .8s linear infinite; flex: 0 0 auto; }',
        '.dshoc-empty { padding: 8px 10px; font-size: 12px; opacity: .55; }'
      ].join('\n');
      document.head.appendChild(style);
    }

    function SidebarOpencode(props) {
      ensureStyles();

      var useSessions = props.useSessions;
      var useWorkspaces = props.useWorkspaces;
      var useSessionStatus = props.useSessionStatus;
      var open = props.open;
      var startSession = props.startSession;
      var archiveSession = props.archiveSession;
      var unarchiveSession = props.unarchiveSession;

      var list = useSessions ? useSessions(function (state) { return state; }) : null;
      var workspaceState = useWorkspaces ? useWorkspaces(function (state) { return state; }) : null;
      var statuses = useSessionStatus ? useSessionStatus(function (state) { return state; }) : null;

      var tick = React.useState(0);
      var version = tick[0];
      var bump = tick[1];

      var orderBox = React.useRef(null);
      if (orderBox.current === null) orderBox.current = readJson(ORDER_KEY, {});
      var expandBox = React.useRef(null);
      if (expandBox.current === null) expandBox.current = readJson(EXPAND_KEY, {});
      var soundBox = React.useRef(null);
      if (soundBox.current === null) soundBox.current = readJson(SOUND_KEY, true);
      var archivedBox = React.useRef(null);
      if (archivedBox.current === null) archivedBox.current = readJson(ARCHIVED_KEY, false);

      var audioBox = React.useRef(null);
      var previousStatus = React.useRef(null);
      var dragId = React.useRef(null);
      var dragWorkspace = React.useRef(null);

      React.useEffect(function () {
        var map = statuses || new Map();
        var previous = previousStatus.current;
        var next = new Map();
        map.forEach(function (status, id) { next.set(id, !!(status && status.completionUnread)); });
        if (previous !== null && soundBox.current) {
          var play = false;
          next.forEach(function (done, id) {
            if (done && previous.get(id) !== true) play = true;
          });
          if (play) playChime(audioBox, SOUND_SRC);
        }
        previousStatus.current = next;
      }, [statuses]);

      var now = Date.now();
      var byId = (list && list.byId) || {};
      var items = (workspaceState && workspaceState.items) || [];
      var archivedIds = (workspaceState && workspaceState.archivedSessionIds) || [];
      var showArchived = archivedBox.current === true;
      var phase = (list && list.phase) || 'loading';

      var children = [];

      children.push(h('div', { className: 'dshoc-head', key: 'head' },
        h('span', null, 'Проекты'),
        h('span', { className: 'dshoc-headactions' },
          h('button', {
            key: 'sound',
            className: 'dshoc-iconbtn' + (soundBox.current ? '' : ' dshoc-off'),
            title: soundBox.current ? 'Звук готовности включён' : 'Звук готовности выключен',
            onClick: function () {
              soundBox.current = !soundBox.current;
              writeJson(SOUND_KEY, soundBox.current);
              bump(version + 1);
            }
          }, iconSound(soundBox.current)),
          h('button', {
            key: 'archived',
            className: 'dshoc-iconbtn' + (showArchived ? '' : ' dshoc-off'),
            title: showArchived ? 'Архивные сессии показаны' : 'Архивные сессии скрыты',
            onClick: function () {
              archivedBox.current = !archivedBox.current;
              writeJson(ARCHIVED_KEY, archivedBox.current);
              bump(version + 1);
            }
          }, iconArchive())
        )
      ));

      if (!items.length) {
        children.push(h('div', { className: 'dshoc-empty', key: 'empty' }, phase === 'ready' ? 'Нет проектов' : 'Загрузка…'));
      }

      items.forEach(function (workspace) {
        var key = workspace.workspaceId;
        var name = workspace.title || workspace.path || 'Проект';
        var expanded = expandBox.current[key] !== false;

        children.push(h('div', {
          key: 'ws:' + key,
          className: 'dshoc-ws',
          title: workspace.path || name,
          onClick: function () {
            expandBox.current[key] = !expanded;
            writeJson(EXPAND_KEY, expandBox.current);
            bump(version + 1);
          }
        },
          h('span', { className: 'dshoc-chip', style: { background: colorFor(name) } }, initialFor(name)),
          h('span', { className: 'dshoc-title' }, name),
          h('button', {
            className: 'dshoc-add',
            title: 'Новая сессия в этом проекте',
            onClick: function (event) {
              event.stopPropagation();
              if (startSession) startSession(key);
            }
          }, '+')
        ));

        if (!expanded) return;

        var memberIds = (workspace.sessionIds || []).slice();
        var rows = [];
        orderedIds(memberIds, orderBox.current[key]).forEach(function (id) {
          var session = byId[id];
          if (!session || session.blank) return;
          var isArchived = archivedIds.indexOf(id) >= 0;
          if (isArchived && !showArchived) return;

          var status = statuses ? statuses.get(id) : null;
          var running = status ? status.running === true : session.running === true;
          var done = status ? status.completionUnread === true : false;
          var pending = status && status.pendingInteraction && status.pendingInteraction.kind ? true : false;

          var indicator;
          if (running) indicator = h('span', { className: 'dshoc-spin' });
          else if (pending) indicator = h('span', { className: 'dshoc-dot', style: { background: '#f5b800' } });
          else if (done) indicator = h('span', { className: 'dshoc-dot', style: { background: '#46a758' } });
          else indicator = h('span', { className: 'dshoc-dot', style: { background: 'transparent' } });

          rows.push(h('div', {
            key: id,
            className: 'dshoc-row' + (isArchived ? ' dshoc-archived' : ''),
            draggable: !isArchived,
            onDragStart: function (event) {
              if (isArchived) return;
              dragId.current = id;
              dragWorkspace.current = key;
              if (event.dataTransfer) {
                event.dataTransfer.effectAllowed = 'move';
                try { event.dataTransfer.setData('text/plain', id); } catch (error) {}
              }
            },
            onDragOver: function (event) {
              if (!isArchived && dragWorkspace.current === key) event.preventDefault();
            },
            onDrop: function (event) {
              event.preventDefault();
              if (isArchived) return;
              var from = dragId.current;
              var to = id;
              if (!from || from === to || dragWorkspace.current !== key) return;
              var currentOrder = orderedIds(memberIds, orderBox.current[key]).filter(function (candidate) {
                var s = byId[candidate];
                return s && !s.blank && archivedIds.indexOf(candidate) < 0;
              });
              var fromIndex = currentOrder.indexOf(from);
              var toIndex = currentOrder.indexOf(to);
              if (fromIndex < 0 || toIndex < 0) return;
              currentOrder.splice(fromIndex, 1);
              currentOrder.splice(toIndex, 0, from);
              orderBox.current[key] = currentOrder;
              writeJson(ORDER_KEY, orderBox.current);
              dragId.current = null;
              bump(version + 1);
            },
            onClick: function () {
              if (isArchived) { if (unarchiveSession) unarchiveSession(id); return; }
              if (open) open(id);
            },
            title: session.title || ''
          },
            indicator,
            h('span', { className: 'dshoc-name' }, session.title || 'Без названия'),
            h('span', { className: 'dshoc-time' }, relativeTime(session.updatedAt, now)),
            h('button', {
              className: 'dshoc-iconbtn',
              title: isArchived ? 'Вернуть из архива' : 'В архив',
              onClick: function (event) {
                event.stopPropagation();
                if (isArchived) { if (unarchiveSession) unarchiveSession(id); return; }
                if (running && !window.confirm('Сессия ещё выполняется. Остановить и отправить в архив?')) return;
                if (archiveSession) archiveSession(id, running ? { stopActivity: true } : {});
              }
            }, isArchived ? iconRestore() : iconArchive())
          ));
        });

        children.push(h('div', { key: 'ss:' + key, className: 'dshoc-sessions' }, rows));
      });

      return h('div', { className: 'dshoc-root' }, children);
    }

    var inject = ['slots', 'locale', 'sessions', 'workspaces', 'uiSession'];

    function apply(ctx) {
      var sessions = ctx.get('sessions');
      var workspaces = ctx.get('workspaces');
      var uiSession = ctx.get('uiSession');

      ctx.slots.inject('sidebar.workspaces', function () {
        return ctx.slots.register({
          name: 'sidebar.workspaces',
          order: -1000,
          locale: NS,
          inject: function () {
            return {
              hooks: {
                sessions: sessions.list,
                workspaces: workspaces.list,
                sessionStatus: uiSession.sessionStatus
              },
              open: function (sessionId) {
                var service = ctx.get('uiWorkspace');
                if (service) service.openSession(sessionId);
              },
              startSession: function (workspaceId) {
                var service = ctx.get('uiWorkspace');
                if (service) service.startSession(workspaceId, {});
              },
              archiveSession: function (sessionId, options) {
                var service = ctx.get('uiWorkspace');
                if (!service) return;
                service.archiveSession(sessionId, options || {}).catch(function (reason) {
                  console.warn('session archive rejected:', reason);
                });
              },
              unarchiveSession: function (sessionId) {
                var service = ctx.get('uiWorkspace');
                if (!service) return;
                service.unarchiveSession(sessionId).catch(function (reason) {
                  console.warn('session unarchive rejected:', reason);
                });
              }
            };
          }
        }, SidebarOpencode);
      });
    }

    return { inject: inject, apply: apply };
  }
});
