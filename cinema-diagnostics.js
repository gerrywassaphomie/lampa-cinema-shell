
(function () {
    'use strict';

    if (window.cinemaDiagSafe) return;
    window.cinemaDiagSafe = true;

    function init() {
        var L = window.Lampa;

        if (!L || !L.Component || !L.Activity) return false;

        try {
            L.Component.add('cinema_diagnostics_safe', function () {
                var root;

                this.create = function () {
                    root = document.createElement('div');
                    root.style.cssText =
                        'padding:30px;color:white;background:#101a2b;' +
                        'font:18px Arial;min-height:80vh';

                    var title = document.createElement('h2');
                    title.textContent = 'Cinema — диагностика';

                    var info = document.createElement('pre');
                    info.style.whiteSpace = 'pre-wrap';

                    var keys = Object.keys(L).sort();
                    info.textContent =
                        'Lampa: доступна\n' +
                        'Модулей: ' + keys.length + '\n\n' +
                        keys.join('\n');

                    var hint = document.createElement('p');
                    hint.textContent =
                        'Сфотографируй этот экран и пришли в чат.';

                    root.appendChild(title);
                    root.appendChild(info);
                    root.appendChild(hint);

                    return window.$ ? $(root) : root;
                };

                this.render = function () {
                    return window.$ ? $(root) : root;
                };

                this.destroy = function () {
                    if (root && root.parentNode) {
                        root.parentNode.removeChild(root);
                    }
                    root = null;
                };
            });
        } catch (e) {
            return false;
        }

        function open() {
            L.Activity.push({
                url: '',
                title: 'Cinema диагностика',
                component: 'cinema_diagnostics_safe',
                page: 1
            });
        }

        function addButton() {
            var menu = document.querySelector('.menu .menu__list');
            if (!menu) return false;
            if (menu.querySelector('[data-cinema-safe]')) return true;

            var item = document.createElement('li');
            item.className = 'menu__item selector';
            item.setAttribute('data-cinema-safe', '1');
            item.textContent = 'Cinema диагностика';
            item.style.cssText = 'padding:15px;color:white;';

            item.addEventListener('click', open);

            if (window.$) {
                $(item).on('hover:enter', open);
            }

            menu.appendChild(item);
            return true;
        }

        addButton();

        if (L.Listener && L.Listener.follow) {
            L.Listener.follow('app', function (event) {
                if (event.type === 'ready') addButton();
            });
        }

        return true;
    }

    var count = 0;

    function retry() {
        if (init()) return;
        count++;
        if (count < 20) setTimeout(retry, 1000);
    }

    if (window.appready) {
        retry();
    } else if (
        window.Lampa &&
        Lampa.Listener &&
        Lampa.Listener.follow
    ) {
        Lampa.Listener.follow('app', function (event) {
            if (event.type === 'ready') retry();
        });
    } else {
        retry();
    }
})();
