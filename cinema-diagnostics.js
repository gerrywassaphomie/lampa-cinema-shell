(function () {
    'use strict';
    if (window.cinema_diagnostics_loaded) return;
    window.cinema_diagnostics_loaded = true;

    function value(path, val) {
        return '<div class="cd-row"><span>' + path + '</span><b>' + String(val) + '</b></div>';
    }

    function report() {
        var L = window.Lampa || {};
        var manifest = L.Manifest || {};
        var platform = L.Platform || {};
        var items = [
            ['window.appready', !!window.appready],
            ['Lampa.Manifest.app_digital', manifest.app_digital == null ? 'не найдено' : manifest.app_digital],
            ['Lampa.Component.add', typeof (L.Component && L.Component.add)],
            ['Lampa.Activity.push', typeof (L.Activity && L.Activity.push)],
            ['Lampa.Maker.make', typeof (L.Maker && L.Maker.make)],
            ['Lampa.ContentRows.add', typeof (L.ContentRows && L.ContentRows.add)],
            ['Lampa.Menu.addButton', typeof (L.Menu && L.Menu.addButton)],
            ['Lampa.Listener.follow', typeof (L.Listener && L.Listener.follow)],
            ['Lampa.Player', typeof L.Player],
            ['Lampa.PlayerPanel', typeof L.PlayerPanel],
            ['Lampa.SettingsApi', typeof L.SettingsApi],
            ['Lampa.Storage', typeof L.Storage],
            ['Lampa.Platform.tv', typeof platform.tv],
            ['Lampa.Platform.tvbox', typeof platform.tvbox],
            ['jQuery ($)', typeof window.$]
        ];
        return items;
    }

    function DiagnosticComponent() {
        var root;
        this.create = function () {
            var rows = report().map(function (item) {
                return '<div class="cd-row"><span>' + item[0] + '</span><b>' + String(item[1]) + '</b></div>';
            }).join('');
            root = document.createElement('div');
            root.className = 'cd-screen';
            root.innerHTML = '<style>.cd-screen{box-sizing:border-box;min-height:100vh;padding:4vh 5vw;background:radial-gradient(ellipse at 80% 0%,#173b67 0,transparent 40%),#080d18;color:#f4f7ff;font:20px/1.4 Arial,sans-serif}.cd-screen h1{font-size:36px;margin:0 0 10px}.cd-screen p{color:#aab8d1;margin:0 0 28px}.cd-list{max-width:1100px}.cd-row{display:flex;justify-content:space-between;gap:30px;padding:13px 18px;margin:5px 0;border:1px solid #273852;border-radius:10px;background:#101a2b}.cd-row span{color:#c7d4ea}.cd-row b{color:#72d5ff;text-align:right}.cd-note{margin-top:25px;padding:18px;border-radius:12px;background:#13233a;color:#b9cce5;max-width:1100px}</style><h1>Cinema · диагностика Lampa</h1><p>Сделай фото этого экрана и пришли его в чат.</p><div class="cd-list">' + rows + '</div><div class="cd-note">Это только чтение доступных интерфейсов. Настройки, источники и текущие плагины не меняются. Часть функций может отсутствовать в твоём форке Lampa.</div>';
            return window.$ ? $(root) : root;
        };
        this.render = function () { return window.$ ? $(root) : root; };
        this.start = function () {};
        this.stop = function () {};
        this.destroy = function () { if (root && root.parentNode) root.parentNode.removeChild(root); root = null; };
    }

    function init() {
        var L = window.Lampa;
        if (!L || !L.Component || !L.Activity) return;
        try { L.Component.add('cinema_diagnostics_screen', DiagnosticComponent); }
        catch (e) { console.warn('[CinemaDiagnostics] component registration failed', e); }

        function open() {
            L.Activity.push({ url: '', title: 'Cinema Diagnostics', component: 'cinema_diagnostics_screen', page: 1 });
        }

        var menu = document.querySelector('.menu .menu__list');
        if (menu && !menu.querySelector('[data-cinema-diagnostics-menu]')) {
            var item = document.createElement('li');
            item.className = 'menu__item selector';
            item.setAttribute('data-cinema-diagnostics-menu', '1');
            item.innerHTML = '<div class="menu__ico">ⓘ</div><div class="menu__text">Cinema диагностика</div>';
            if (window.$) $(item).on('hover:enter', open);
            item.addEventListener('click', open);
            menu.appendChild(item);
        }
        console.log('[CinemaDiagnostics] ready', report());
    }

    if (window.appready) init();
    else if (window.Lampa && Lampa.Listener && Lampa.Listener.follow) {
        Lampa.Listener.follow('app', function (event) { if (event.type === 'ready') init(); });
    } else {
        var attempts = 0;
        var retry = function () {
            attempts++;
            if (window.appready && window.Lampa) init();
            else if (attempts < 20) setTimeout(retry, 500);
        };
        retry();
    }
})();
