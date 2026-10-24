
(function () {
    'use strict';

    var READY = 'plugin_cinema_diagnostics_ready';
    var COMPONENT = 'cinema_shell_home';
    var MENU_ID = 'cinema-shell-menu-item';

    function startCinemaShell() {
        // Стандартный флаг плагина Lampa.
        window[READY] = true;

        var initialized = false;

        function addStyles() {
            if (document.getElementById('cinema-shell-styles')) return;

            var css = [
                '.cinema-shell{min-height:100vh;box-sizing:border-box;',
                'padding:36px 4vw 60px;color:#fff;',
                'font-family:Arial,sans-serif;',
                'background:radial-gradient(ellipse at 75% 5%,',
                '#27364c 0%,#111824 38%,#080a0f 78%);}',
                '.cinema-shell *{box-sizing:border-box;}',
                '.cinema-shell__top{display:flex;align-items:center;',
                'justify-content:space-between;margin-bottom:36px;}',
                '.cinema-shell__brand{font-size:24px;font-weight:700;',
                'letter-spacing:3px;}',
                '.cinema-shell__nav{display:flex;gap:24px;',
                'color:#aab5c5;font-size:16px;}',
                '.cinema-shell__hero{position:relative;overflow:hidden;',
                'min-height:340px;border-radius:22px;padding:42px;',
                'display:flex;align-items:flex-end;',
                'background:linear-gradient(90deg,',
                'rgba(5,8,14,.98),rgba(5,8,14,.68) 48%,',
                'rgba(5,8,14,.08)),',
                'radial-gradient(ellipse at 78% 35%,',
                '#8b9eae 0%,#354a60 20%,#172437 44%,#10131c 75%);',
                'box-shadow:0 20px 60px rgba(0,0,0,.35);}',
                '.cinema-shell__hero-content{max-width:680px;}',
                '.cinema-shell__eyebrow{color:#9eb9d6;',
                'font-size:13px;letter-spacing:3px;',
                'text-transform:uppercase;margin-bottom:14px;}',
                '.cinema-shell__title{font-size:clamp(34px,5vw,62px);',
                'font-weight:700;line-height:1.05;',
                'margin:0 0 16px;}',
                '.cinema-shell__description{max-width:560px;',
                'font-size:17px;line-height:1.55;',
                'color:#c3ccd8;margin-bottom:24px;}',
                '.cinema-shell__actions{display:flex;gap:12px;',
                'flex-wrap:wrap;}',
                '.cinema-shell__button{padding:13px 22px;',
                'border-radius:9px;background:#fff;color:#10131a;',
                'font-size:16px;font-weight:700;border:2px solid transparent;}',
                '.cinema-shell__button--secondary{background:rgba(255,255,255,.1);',
                'color:#fff;border-color:rgba(255,255,255,.24);}',
                '.cinema-shell__section{margin-top:34px;}',
                '.cinema-shell__section-title{font-size:23px;',
                'font-weight:700;margin-bottom:18px;}',
                '.cinema-shell__cards{display:grid;',
                'grid-template-columns:repeat(5,minmax(0,1fr));gap:16px;}',
                '.cinema-shell__card{min-width:0;border-radius:12px;',
                'overflow:hidden;background:#171e29;',
                'border:3px solid transparent;',
                'transition:transform .15s,border-color .15s;}',
                '.cinema-shell__card:focus,',
                '.cinema-shell__card.hover,',
                '.cinema-shell__card:focus-visible{outline:none;',
                'border-color:#fff;transform:scale(1.035);}',
                '.cinema-shell__poster{height:190px;',
                'display:flex;align-items:flex-end;padding:14px;',
                'font-size:21px;font-weight:700;',
                'background:linear-gradient(155deg,#63798b,#202b3b 60%,#0a0e15);}',
                '.cinema-shell__poster--2{background:linear-gradient(155deg,#a17e69,#43332f 55%,#151114);}',
                '.cinema-shell__poster--3{background:linear-gradient(155deg,#5c7f82,#203e42 55%,#0a1115);}',
                '.cinema-shell__poster--4{background:linear-gradient(155deg,#8c8ba8,#39344f 55%,#11101c);}',
                '.cinema-shell__poster--5{background:linear-gradient(155deg,#b49b68,#51452f 55%,#15130d);}',
                '.cinema-shell__card-name{padding:12px 13px 5px;',
                'font-size:15px;font-weight:700;}',
                '.cinema-shell__card-meta{padding:0 13px 14px;',
                'color:#9da9ba;font-size:13px;}',
                '.cinema-shell__note{margin-top:26px;color:#8d9aac;',
                'font-size:14px;}',
                '@media(max-width:800px){',
                '.cinema-shell{padding:22px 18px 40px;}',
                '.cinema-shell__hero{min-height:300px;padding:24px;}',
                '.cinema-shell__cards{grid-template-columns:repeat(2,minmax(0,1fr));}',
                '.cinema-shell__poster{height:150px;}',
                '.cinema-shell__nav{gap:10px;}}'
            ].join('');

            var style = document.createElement('style');
            style.id = 'cinema-shell-styles';
            style.textContent = css;
            document.head.appendChild(style);
        }

        function CinemaHome() {
            var html;

            this.create = function () {
                html = $(
                    '<div class="cinema-shell">' +
                        '<header class="cinema-shell__top">' +
                            '<div class="cinema-shell__brand">CINEMA</div>' +
                            '<div class="cinema-shell__nav">' +
                                '<span>Главная</span>' +
                                '<span>Фильмы</span>' +
                                '<span>Сериалы</span>' +
                                '<span>Поиск</span>' +
                            '</div>' +
                        '</header>' +

                        '<section class="cinema-shell__hero">' +
                            '<div class="cinema-shell__hero-content">' +
                                '<div class="cinema-shell__eyebrow">' +
                                    'Ваш домашний кинотеатр' +
                                '</div>' +
                                '<h1 class="cinema-shell__title">' +
                                    'Истории, которые<br>стоит увидеть.' +
                                '</h1>' +
                                '<div class="cinema-shell__description">' +
                                    'Минималистичный интерфейс, большие постеры ' +
                                    'и всё, что хочется посмотреть, в одном месте.' +
                                '</div>' +
                                '<div class="cinema-shell__actions">' +
                                    '<button class="cinema-shell__button selector" ' +
                                    'id="cinema-shell-start">' +
                                        'Начать просмотр' +
                                    '</button>' +
                                    '<button class="cinema-shell__button ' +
                                    'cinema-shell__button--secondary selector" ' +
                                    'id="cinema-shell-search">' +
                                        'Поиск' +
                                    '</button>' +
                                '</div>' +
                            '</div>' +
                        '</section>' +

                        '<section class="cinema-shell__section">' +
                            '<div class="cinema-shell__section-title">' +
                                'Ваша коллекция' +
                            '</div>' +
                            '<div class="cinema-shell__cards">' +
                                '<div class="cinema-shell__card selector" tabindex="0">' +
                                    '<div class="cinema-shell__poster">' +
                                        '01' +
                                    '</div>' +
                                    '<div class="cinema-shell__card-name">Драма</div>' +
                                    '<div class="cinema-shell__card-meta">Подборка</div>' +
                                '</div>' +
                                '<div class="cinema-shell__card selector" tabindex="0">' +
                                    '<div class="cinema-shell__poster cinema-shell__poster--2">' +
                                        '02' +
                                    '</div>' +
                                    '<div class="cinema-shell__card-name">Приключения</div>' +
                                    '<div class="cinema-shell__card-meta">Подборка</div>' +
                                '</div>' +
                                '<div class="cinema-shell__card selector" tabindex="0">' +
                                    '<div class="cinema-shell__poster cinema-shell__poster--3">' +
                                        '03' +
                                    '</div>' +
                                    '<div class="cinema-shell__card-name">Фантастика</div>' +
                                    '<div class="cinema-shell__card-meta">Подборка</div>' +
                                '</div>' +
                                '<div class="cinema-shell__card selector" tabindex="0">' +
                                    '<div class="cinema-shell__poster cinema-shell__poster--4">' +
                                        '04' +
                                    '</div>' +
                                    '<div class="cinema-shell__card-name">Сериалы</div>' +
                                    '<div class="cinema-shell__card-meta">Подборка</div>' +
                                '</div>' +
                                '<div class="cinema-shell__card selector" tabindex="0">' +
                                    '<div class="cinema-shell__poster cinema-shell__poster--5">' +
                                        '05' +
                                    '</div>' +
                                    '<div class="cinema-shell__card-name">На вечер</div>' +
                                    '<div class="cinema-shell__card-meta">Подборка</div>' +
                                '</div>' +
                            '</div>' +
                        '</section>' +

                        '<div class="cinema-shell__note">' +
                            'CINEMA SHELL · CONCEPT 1.0' +
                        '</div>' +
                    '</div>'
                );

                html.find('#cinema-shell-start').on('hover:enter click', function () {
                    Lampa.Noty.show(
                        'Визуальная оболочка запущена. Подключение каталога — следующий этап.'
                    );
                });

                html.find('#cinema-shell-search').on('hover:enter click', function () {
                    Lampa.Noty.show(
                        'Поиск подключим к каталогу Lampa на следующем этапе.'
                    );
                });

                html.find('.cinema-shell__card').on('hover:enter click', function () {
                    Lampa.Noty.show(
                        'Это демонстрационная карточка. Реальные фильмы подключим из каталога.'
                    );
                });

                return html;
            };

            this.start = function () {};

            this.stop = function () {};

            this.pause = function () {};

            this.render = function () {
                if (!html) return this.create();
                return html;
            };

            this.destroy = function () {
                if (html) html.remove();
                html = null;
            };

            this.back = function () {
                Lampa.Activity.backward();
            };
        }

        function init() {
            if (initialized) return;
            if (!window.Lampa || !window.$) return;

            initialized = true;

            addStyles();

            Lampa.Component.add(COMPONENT, CinemaHome);

            // Удаляем старую кнопку, если плагин был перезагружен.
            $('#' + MENU_ID).remove();

            var item = $(
                '<li class="menu__item selector" id="' + MENU_ID + '">' +
                    '<div class="menu__text">Cinema</div>' +
                '</li>'
            );

            item.on('hover:enter', function () {
                Lampa.Activity.push({
                    url: '',
                    title: 'Cinema',
                    component: COMPONENT,
                    page: 1
                });
            });

            var menu = $('.menu .menu__list').eq(0);

            if (menu.length) {
                menu.append(item);
            } else {
                initialized = false;
                console.error('[CinemaShell] Меню Lampa не найдено.');
            }
        }

        if (window.appready) {
            init();
        } else if (
            window.Lampa &&
            Lampa.Listener &&
            typeof Lampa.Listener.follow === 'function'
        ) {
            Lampa.Listener.follow('app', function (event) {
                if (event.type === 'ready') init();
            });
        }
    }

    if (!window.plugin_cinema_diagnostics_ready) {
        startCinemaShell();
    }
})();
