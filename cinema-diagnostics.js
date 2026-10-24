
(function () {
    'use strict';

    var NAME = 'cinema_diagnostics';
    var VERSION = '4.0.0';
    var GUARD = '__cinemaDiagnosticsV4';
    var L = null;
    var state = {
        started: false,
        component: false,
        menu: false,
        head: false,
        errors: [],
        events: [],
        opened: false,
        report: ''
    };

    if (window[GUARD]) return;
    window[GUARD] = true;

    function log(message) {
        try {
            console.log('[CinemaDiag] ' + message);
        } catch (e) {}
    }

    function errorText(error) {
        try {
            return String(
                error && (error.stack || error.message) || error
            );
        } catch (e) {
            return 'Unknown error';
        }
    }

    function recordError(where, error) {
        state.errors.push({
            time: new Date().toISOString(),
            where: where,
            message: errorText(error)
        });

        if (state.errors.length > 40) state.errors.shift();
        log(where + ': ' + errorText(error));
    }

    function event(name, detail) {
        state.events.push({
            time: new Date().toISOString(),
            name: name,
            detail: detail || ''
        });

        if (state.events.length > 50) state.events.shift();
    }

    function safe(fn, fallback) {
        try {
            return fn();
        } catch (e) {
            return fallback;
        }
    }

    function getMethods(object) {
        var result = [];
        var key;

        if (!object) return result;

        try {
            for (key in object) {
                if (typeof object[key] === 'function') {
                    result.push(key);
                }
            }
        } catch (e) {}

        return result.sort();
    }

    function getKeys(object) {
        return safe(function () {
            return Object.keys(object || {}).sort();
        }, []);
    }

    function storageInfo(storage) {
        var result = {
            available: false,
            length: 0,
            keys: [],
            error: ''
        };

        try {
            if (!storage) {
                result.error = 'Недоступно';
                return result;
            }

            result.available = true;
            result.length = storage.length;

            for (var i = 0; i < storage.length && i < 100; i++) {
                var key = storage.key(i);
                if (key !== null) result.keys.push(key);
            }

            result.keys.sort();
        } catch (e) {
            result.error = errorText(e);
        }

        return result;
    }

    function buildReport() {
        L = window.Lampa || null;

        var apiNames = [
            'Activity', 'Component', 'Listener', 'Menu', 'Head',
            'Controller', 'Settings', 'SettingsApi', 'Storage',
            'Lang', 'Template', 'Scroll', 'Modal', 'Select',
            'Noty', 'Reguest', 'Request', 'Player', 'PlayerVideo',
            'PlayerPanel', 'Manifest', 'Platform', 'Favorite',
            'Utils', 'Input', 'Card'
        ];

        var apis = {};

        apiNames.forEach(function (name) {
            var api = L && L[name];

            apis[name] = {
                available: !!api,
                type: api ? typeof api : 'undefined',
                methods: getMethods(api)
            };
        });

        var scripts = safe(function () {
            var list = document.getElementsByTagName('script');
            var found = [];

            for (var i = 0; i < list.length; i++) {
                var src = list[i].src || '';

                if (src.indexOf('cinema-diagnostics') !== -1) {
                    found.push(src);
                }
            }

            return found;
        }, []);

        var report = {
            plugin: {
                name: NAME,
                version: VERSION,
                started: state.started,
                opened: state.opened,
                componentRegistered: state.component,
                menuRegistered: state.menu,
                headRegistered: state.head,
                startedAt: startedAt,
                scripts: scripts
            },
            runtime: {
                userAgent: safe(function () {
                    return navigator.userAgent;
                }, ''),
                platform: safe(function () {
                    return navigator.platform;
                }, ''),
                language: safe(function () {
                    return navigator.language;
                }, ''),
                online: safe(function () {
                    return navigator.onLine;
                }, false),
                screen: {
                    width: safe(function () {
                        return screen.width;
                    }, 0),
                    height: safe(function () {
                        return screen.height;
                    }, 0),
                    pixelRatio: safe(function () {
                        return window.devicePixelRatio;
                    }, 0),
                    innerWidth: safe(function () {
                        return window.innerWidth;
                    }, 0),
                    innerHeight: safe(function () {
                        return window.innerHeight;
                    }, 0)
                },
                documentState: document.readyState,
                appready: window.appready,
                jquery: typeof window.$,
                localStorage: storageInfo(
                    safe(function () {
                        return window.localStorage;
                    }, null)
                ),
                sessionStorage: storageInfo(
                    safe(function () {
                        return window.sessionStorage;
                    }, null)
                )
            },
            lampa: {
                available: !!L,
                keys: getKeys(L),
                apis: apis
            },
            errors: state.errors.slice(),
            events: state.events.slice()
        };

        state.report = JSON.stringify(report, null, 2);
        return state.report;
    }

    var startedAt = new Date().toISOString();

    function createScreen() {
        var root = document.createElement('div');

        root.style.cssText =
            'box-sizing:border-box;width:100%;min-height:100vh;' +
            'padding:30px;color:#f5f7fb;background:#0b1018;' +
            'font-family:Arial,sans-serif;font-size:18px;' +
            'overflow:auto;';

        var title = document.createElement('h1');
        title.textContent = 'CINEMA DIAGNOSTICS ' + VERSION;
        title.style.cssText =
            'font-size:30px;color:#8ddcff;margin:0 0 16px;';

        var status = document.createElement('div');
        status.textContent = 'Плагин запущен. Формирование отчёта...';
        status.style.cssText = 'margin:12px 0 20px;';

        var description = document.createElement('p');
        description.textContent =
            'Техническая информация о Lampa, загрузке плагина и ошибках. ' +
            'Содержимое хранилищ и учётные данные не читаются.';
        description.style.cssText =
            'max-width:1100px;line-height:1.5;color:#bdc8d8;';

        var actions = document.createElement('div');
        actions.style.cssText = 'margin:20px 0;';

        var output = document.createElement('textarea');
        output.readOnly = true;
        output.setAttribute('aria-label', 'Отчёт диагностики');
        output.style.cssText =
            'display:block;box-sizing:border-box;width:100%;' +
            'height:52vh;padding:16px;border:1px solid #35465d;' +
            'border-radius:8px;background:#080c12;color:#e4efff;' +
            'font:14px monospace;';

        function button(label, action) {
            var b = document.createElement('button');

            b.textContent = label;
            b.style.cssText =
                'padding:14px 20px;margin:0 12px 12px 0;' +
                'border:0;border-radius:8px;background:#8ddcff;' +
                'color:#07111c;font-size:18px;cursor:pointer;';

            b.onclick = action;
            actions.appendChild(b);

            return b;
        }

        function refresh() {
            try {
                output.value = buildReport();
                status.textContent =
                    'Отчёт готов. Зафиксировано ошибок: ' +
                    state.errors.length;
            } catch (e) {
                recordError('refresh', e);
                status.textContent = 'Ошибка формирования отчёта.';
            }
        }

        button('Обновить отчёт', refresh);

        button('Скопировать отчёт', function () {
            try {
                output.focus();
                output.select();

                var copied = document.execCommand('copy');

                status.textContent = copied ?
                    'Выполнена попытка копирования.' :
                    'Не удалось скопировать автоматически. ' +
                    'Выдели текст и скопируй вручную.';
            } catch (e) {
                status.textContent =
                    'Выдели текст отчёта и скопируй вручную.';
            }
        });

        button('Назад', function () {
            try {
                if (L && L.Activity &&
                    typeof L.Activity.backward === 'function') {
                    L.Activity.backward();
                }
            } catch (e) {
                recordError('backward', e);
            }
        });

        root.appendChild(title);
        root.appendChild(status);
        root.appendChild(description);
        root.appendChild(actions);
        root.appendChild(output);

        refresh();
        return root;
    }

    function openDiagnostics() {
        L = window.Lampa || null;

        try {
            if (!L || !L.Activity || !L.Component) {
                throw new Error('Lampa.Activity или Lampa.Component недоступны');
            }

            if (typeof L.Activity.push !== 'function') {
                throw new Error('Lampa.Activity.push недоступен');
            }

            if (!state.component) {
                registerComponent();
            }

            if (!state.component) {
                throw new Error('Компонент диагностики не зарегистрирован');
            }

            L.Activity.push({
                url: '',
                title: 'Cinema Diagnostics',
                component: NAME,
                page: 1
            });

            state.opened = true;
            event('screen.open', 'Activity.push выполнен');
            log('Экран диагностики открыт');
        } catch (e) {
            recordError('openDiagnostics', e);
            showFallback();
        }
    }

    function showFallback() {
        try {
            var old = document.getElementById('cinema-diag-fallback');

            if (old) old.parentNode.removeChild(old);

            var overlay = document.createElement('div');
            overlay.id = 'cinema-diag-fallback';
            overlay.style.cssText =
                'position:fixed;z-index:2147483647;left:3%;top:3%;' +
                'width:94%;height:94%;box-sizing:border-box;' +
                'padding:24px;background:#0b1018;color:white;' +
                'border:2px solid #8ddcff;overflow:auto;' +
                'font:16px Arial,sans-serif;';

            var heading = document.createElement('h2');
            heading.textContent = 'Cinema Diagnostics ' + VERSION;

            var close = document.createElement('button');
            close.textContent = 'Закрыть';
            close.style.cssText =
                'padding:12px 20px;margin-bottom:15px;font-size:18px;';

            close.onclick = function () {
                if (overlay.parentNode) {
                    overlay.parentNode.removeChild(overlay);
                }
            };

            var output = document.createElement('textarea');
            output.readOnly = true;
            output.value = buildReport();
            output.style.cssText =
                'width:100%;height:75%;box-sizing:border-box;' +
                'background:#05080d;color:#e4efff;font:13px monospace;';

            overlay.appendChild(heading);
            overlay.appendChild(close);
            overlay.appendChild(output);

            (document.body || document.documentElement).appendChild(overlay);
            state.opened = true;
        } catch (e) {
            recordError('showFallback', e);
            log(buildReport());
        }
    }

    function registerComponent() {
        L = window.Lampa || null;

        if (!L || !L.Component ||
            typeof L.Component.add !== 'function') {
            return false;
        }

        try {
            L.Component.add(NAME, function () {
                var root = null;

                this.create = function () {
                    root = createScreen();
                    return window.$ ? window.$(root) : root;
                };

                this.render = function () {
                    if (!root) root = createScreen();
                    return window.$ ? window.$(root) : root;
                };

                this.start = function () {
                    event('component.start', NAME);
                };

                this.pause = function () {};
                this.stop = function () {};

                this.back = function () {
                    if (L && L.Activity &&
                        typeof L.Activity.backward === 'function') {
                        L.Activity.backward();
                    }
                };

                this.destroy = function () {
                    if (root && root.parentNode) {
                        root.parentNode.removeChild(root);
                    }

                    root = null;
                };
            });

            state.component = true;
            event('component.registered', NAME);
            return true;
        } catch (e) {
            recordError('Component.add', e);
            return false;
        }
    }

    function registerMenu() {
        L = window.Lampa || null;

        if (!L || !L.Menu ||
            typeof L.Menu.addButton !== 'function') {
            return false;
        }

        try {
            var icon =
                '<svg viewBox="0 0 24 24" width="24" height="24">' +
                '<path fill="currentColor" d="M12 2a10 10 0 1 0 0 20 ' +
                '10 10 0 0 0 0-20zm1 15h-2v-2h2zm0-4h-2c0-3 3-3 ' +
                '3-5a2 2 0 0 0-4 0H8a4 4 0 0 1 8 0c0 3-3 3-3 5z"/>' +
                '</svg>';

            L.Menu.addButton(icon, 'Cinema Diagnostics', openDiagnostics);
            state.menu = true;
            event('menu.registered', 'Lampa.Menu.addButton');
            return true;
        } catch (e) {
            recordError('Menu.addButton', e);
            return false;
        }
    }

    function registerHead() {
        L = window.Lampa || null;

        if (!L || !L.Head ||
            typeof L.Head.addIcon !== 'function') {
            return false;
        }

        try {
            var icon =
                '<svg viewBox="0 0 24 24" width="24" height="24">' +
                '<path fill="currentColor" d="M12 2a10 10 0 1 0 0 20 ' +
                '10 10 0 0 0 0-20zm1 15h-2v-2h2zm0-4h-2c0-3 3-3 ' +
                '3-5a2 2 0 0 0-4 0H8a4 4 0 0 1 8 0c0 3-3 3-3 5z"/>' +
                '</svg>';

            L.Head.addIcon(icon, openDiagnostics);
            state.head = true;
            event('head.registered', 'Lampa.Head.addIcon');
            return true;
        } catch (e) {
            recordError('Head.addIcon', e);
            return false;
        }
    }

    function init() {
        if (state.started) return true;

        L = window.Lampa || null;

        if (!L || !L.Component || !L.Activity) {
            return false;
        }

        registerComponent();

        if (!state.component) {
            return false;
        }

        registerMenu();
        registerHead();

        state.started = true;
        event('init.complete', VERSION);
        log('Initialized v' + VERSION);

        if (!window.__cinemaDiagV4AutoOpened) {
            window.__cinemaDiagV4AutoOpened = true;

            setTimeout(function () {
                openDiagnostics();
            }, 1200);
        }

        return true;
    }

    window.addEventListener('error', function (e) {
        recordError('window.error', {
            message: e.message,
            source: e.filename,
            line: e.lineno,
            column: e.colno
        });
    });

    window.addEventListener('unhandledrejection', function (e) {
        recordError('unhandledrejection', e.reason);
    });

    function boot() {
        if (init()) return;

        if (boot.attempts >= 60) {
            recordError('boot', 'Lampa API не готова после 60 попыток');
            showFallback();
            return;
        }

        boot.attempts++;
        setTimeout(boot, 1000);
    }

    boot.attempts = 0;

    if (window.appready) {
        boot();
    } else {
        L = window.Lampa || null;

        if (L && L.Listener &&
            typeof L.Listener.follow === 'function') {
            try {
                L.Listener.follow('app', function (e) {
                    if (e && e.type === 'ready') boot();
                });
            } catch (e) {
                recordError('Listener.follow', e);
            }
        }

        boot();
    }
})();
