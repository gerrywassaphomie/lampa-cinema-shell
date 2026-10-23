
(function () {
    'use strict';

    var PLUGIN = 'cinema_diagnostics';
    var VERSION = '3.0.0';
    var L = window.Lampa;
    var PREFIX = '[CinemaDiag] ';

    if (window.cinemaDiagnosticsV3) return;
    window.cinemaDiagnosticsV3 = true;

    var state = {
        initialized: false,
        componentRegistered: false,
        menuRegistered: false,
        domMenuRegistered: false,
        initAttempts: 0,
        errors: [],
        events: [],
        startedAt: new Date().toISOString(),
        lastReport: ''
    };

    function log(message) {
        try {
            console.log(PREFIX + message);
        } catch (e) {}
    }

    function errorText(e) {
        try {
            return e && (e.stack || e.message) ?
                String(e.stack || e.message) : String(e);
        } catch (x) {
            return 'Unknown error';
        }
    }

    function addError(where, e) {
        state.errors.push({
            time: new Date().toISOString(),
            where: where,
            error: errorText(e)
        });

        if (state.errors.length > 30) {
            state.errors.shift();
        }

        log(where + ': ' + errorText(e));
    }

    function safe(fn, fallback) {
        try {
            return fn();
        } catch (e) {
            return fallback;
        }
    }

    function has(obj, key) {
        return !!obj && typeof obj[key] !== 'undefined';
    }

    function typeOf(obj, key) {
        return !obj ? 'нет объекта' : typeof obj[key];
    }

    function keysOf(obj) {
        return safe(function () {
            return Object.keys(obj || {}).sort();
        }, []);
    }

    function methodsOf(obj) {
        return keysOf(obj).filter(function (key) {
            return typeof obj[key] === 'function';
        });
    }

    function addEvent(name, data) {
        state.events.push({
            time: new Date().toISOString(),
            event: name,
            detail: data || ''
        });

        if (state.events.length > 40) {
            state.events.shift();
        }
    }

    function storageReport(storage) {
        try {
            var result = {
                available: false,
                keyCount: 0,
                keys: [],
                error: ''
            };

            if (!storage) {
                result.error = 'API недоступен';
                return result;
            }

            result.available = true;
            result.keyCount = storage.length;

            for (var i = 0; i < storage.length && i < 100; i++) {
                var key = storage.key(i);
                if (key !== null) result.keys.push(key);
            }

            result.keys.sort();
            return result;
        } catch (e) {
            return {
                available: false,
                keyCount: 0,
                keys: [],
                error: errorText(e)
            };
        }
    }

    function apiReport() {
        var names = [
            'Activity', 'Component', 'Listener', 'Menu',
            'Controller', 'Settings', 'SettingsApi',
            'Storage', 'Lang', 'Template', 'Scroll',
            'Modal', 'Select', 'Noty', 'Reguest',
            'Request', 'Player', 'PlayerVideo',
            'PlayerPanel', 'Manifest', 'Platform',
            'Account', 'Favorite', 'FavoriteStorage',
            'Repository', 'Utils', 'Timeline',
            'Subscribe', 'Interaction', 'Card',
            'Full', 'Files', 'Input'
        ];

        var result = {};

        names.forEach(function (name) {
            var api = L && L[name];

            result[name] = {
                available: !!api,
                type: api ? typeof api : 'undefined',
                methods: methodsOf(api)
            };
        });

        return result;
    }

    function buildReport() {
        var report = {
            plugin: {
                name: PLUGIN,
                version: VERSION,
                initialized: state.initialized,
                initAttempts: state.initAttempts,
                startedAt: state.startedAt,
                currentScript: safe(function () {
                    return document.currentScript ?
                        document.currentScript.src : 'недоступен';
                }, 'ошибка чтения')
            },

            runtime: {
                userAgent: safe(function () {
                    return navigator.userAgent;
                }, 'недоступен'),
                platform: safe(function () {
                    return navigator.platform;
                }, 'недоступна'),
                language: safe(function () {
                    return navigator.language;
                }, 'недоступен'),
                online: safe(function () {
                    return navigator.onLine;
                }, 'недоступно'),
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
                localStorage: storageReport(
                    safe(function () {
                        return window.localStorage;
                    }, null)
                ),
                sessionStorage: storageReport(
                    safe(function () {
                        return window.sessionStorage;
                    }, null)
                )
            },

            lampa: {
                available: !!L,
                type: typeof L,
                topLevelKeys: keysOf(L),
                apis: apiReport()
            },

            pluginStatus: {
                componentRegistered: state.componentRegistered,
                menuRegistered: state.menuRegistered,
                domMenuRegistered: state.domMenuRegistered
            },

            dom: {
                bodyAvailable: !!document.body,
                menuListFound: !!safe(function () {
                    return document.querySelector(
                        '.menu .menu__list, .menu__list'
                    );
                }, null),
                scriptTags: safe(function () {
                    var scripts = document.getElementsByTagName('script');
                    var found = [];

                    for (var i = 0; i < scripts.length; i++) {
                        var src = scripts[i].src || '';

                        if (src.indexOf('cinema-diagnostics') !== -1) {
                            found.push(src);
                        }
                    }

                    return found;
                }, [])
            },

            errors: state.errors.slice(),
            recentEvents: state.events.slice()
        };

        state.lastReport = JSON.stringify(report, null, 2);
        return state.lastReport;
    }

    function createScreen() {
        var root = document.createElement('div');

        root.style.cssText =
            'box-sizing:border-box;padding:24px;' +
            'color:#fff;background:#101a2b;' +
            'font:16px Arial,sans-serif;' +
            'min-height:100vh;overflow:auto;';

        var title = document.createElement('h2');
        title.textContent = 'Cinema — диагностика v' + VERSION;
        title.style.cssText = 'margin:0 0 12px;color:#72d5ff;';

        var status = document.createElement('p');
        status.textContent = 'Сбор информации...';

        var help = document.createElement('p');
        help.textContent =
            'Отчёт содержит сведения об API и ошибках. ' +
            'Значения хранилищ и учётные данные не читаются.';

        var refresh = document.createElement('button');
        refresh.textContent = 'Обновить отчёт';
        refresh.style.cssText =
            'padding:12px;margin:8px 8px 8px 0;' +
            'font-size:16px;color:#111;background:#72d5ff;';

        var copy = document.createElement('button');
        copy.textContent = 'Скопировать отчёт';
        copy.style.cssText =
            'padding:12px;margin:8px;' +
            'font-size:16px;color:#111;background:#72d5ff;';

        var output = document.createElement('textarea');
        output.readOnly = true;
        output.style.cssText =
            'display:block;box-sizing:border-box;width:100%;' +
            'height:55vh;margin-top:12px;padding:12px;' +
            'color:#eaf4ff;background:#07101c;' +
            'border:1px solid #72d5ff;font:13px monospace;';

        function refreshReport() {
            try {
                output.value = buildReport();
                status.textContent =
                    'Отчёт обновлён. Ошибок: ' + state.errors.length;
            } catch (e) {
                status.textContent = 'Ошибка формирования отчёта';
                addError('buildReport', e);
            }
        }

        refresh.onclick = refreshReport;

        copy.onclick = function () {
            try {
                output.focus();
                output.select();

                var ok = document.execCommand('copy');

                status.textContent = ok ?
                    'Попытка копирования выполнена.' :
                    'Копирование не поддерживается. Выдели текст вручную.';
            } catch (e) {
                status.textContent =
                    'Выдели текст отчёта и скопируй вручную.';
            }
        };

        root.appendChild(title);
        root.appendChild(status);
        root.appendChild(help);
        root.appendChild(refresh);
        root.appendChild(copy);
        root.appendChild(output);

        refreshReport();

        return root;
    }

    function openDiagnostics() {
        try {
            if (!L || !L.Activity || !L.Component) {
                addError('openDiagnostics', 'Activity/Component недоступны');
                return;
            }

            L.Activity.push({
                url: '',
                title: 'Cinema — диагностика',
                component: PLUGIN,
                page: 1
            });

            addEvent('activity.push', 'Экран диагностики открыт');
        } catch (e) {
            addError('Activity.push', e);
        }
    }

    function registerComponent() {
        if (!L || !L.Component ||
            typeof L.Component.add !== 'function') {
            return false;
        }

        try {
            L.Component.add(PLUGIN, function () {
                var root;

                this.create = function () {
                    root = createScreen();

                    return window.$ ? $(root) : root;
                };

                this.render = function () {
                    if (!root) root = createScreen();

                    return window.$ ? $(root) : root;
                };

                this.start = function () {
                    addEvent('component.start', PLUGIN);
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

            state.componentRegistered = true;
            log('Component registered');
            return true;
        } catch (e) {
            addError('Component.add', e);
            return false;
        }
    }

    function registerNativeMenu() {
        if (!L || !L.Menu ||
            typeof L.Menu.addButton !== 'function') {
            return false;
        }

        try {
            var icon =
                '<svg viewBox="0 0 24 24" width="24" height="24">' +
                '<path fill="currentColor" d="M12 2a10 10 0 1 0 0 20' +
                ' 10 10 0 0 0 0-20zm1 15h-2v-2h2zm0-4h-2' +
                'c0-3 3-3 3-5a2 2 0 0 0-4 0H8a4 4 0 0 1 8 0' +
                'c0 3-3 3-3 5z"/></svg>';

            L.Menu.addButton(icon, 'Cinema диагностика', openDiagnostics);

            state.menuRegistered = true;
            log('Native menu registered');
            return true;
        } catch (e) {
            addError('Menu.addButton', e);
            return false;
        }
    }

    function registerDomMenu() {
        var menu = safe(function () {
            return document.querySelector(
                '.menu .menu__list, .menu__list'
            );
        }, null);

        if (!menu) return false;

        if (menu.querySelector('[data-cinema-diagnostics-v3]')) {
            state.domMenuRegistered = true;
            return true;
        }

        var item = document.createElement('li');

        item.className = 'menu__item selector';
        item.setAttribute('data-cinema-diagnostics-v3', '1');
        item.textContent = 'Cinema диагностика';
        item.style.cssText = 'padding:15px;color:white;';

        item.onclick = openDiagnostics;

        if (window.$) {
            try {
                $(item).on('hover:enter', openDiagnostics);
            } catch (e) {
                addError('DOM menu hover handler', e);
            }
        }

        menu.appendChild(item);
        state.domMenuRegistered = true;

        return true;
    }

    function init() {
        state.initAttempts++;

        L = window.Lampa;

        if (!L || !L.Component || !L.Activity) {
            return false;
        }

        registerComponent();

        if (!state.componentRegistered) {
            return false;
        }

        registerNativeMenu();

        if (!state.menuRegistered) {
            registerDomMenu();
        }

        state.initialized = true;
        addEvent('init', 'Инициализация завершена');
        log('Initialized v' + VERSION);

        return true;
    }

    window.addEventListener('error', function (e) {
        addError('window.error', {
            message: e.message,
            source: e.filename,
            line: e.lineno,
            column: e.colno
        });
    });

    window.addEventListener('unhandledrejection', function (e) {
        addError('unhandledrejection', e.reason);
    });

    function start() {
        if (init()) return;

        if (state.initAttempts < 30) {
            setTimeout(start, 1000);
        } else {
            addError(
                'init',
                'Lampa API не готов после 30 попыток'
            );
        }
    }

    if (window.appready) {
        start();
    } else if (L && L.Listener &&
        typeof L.Listener.follow === 'function') {

        L.Listener.follow('app', function (event) {
            addEvent('app:' + event.type);

            if (event.type === 'ready') start();
        });

        start();
    } else {
        start();
    }
})();
