
(function () {
    'use strict';

    var ID = 'cinema-diag-execution-test';

    function show() {
        if (document.getElementById(ID)) return;

        var panel = document.createElement('div');
        panel.id = ID;

        panel.style.cssText =
            'position:fixed;z-index:2147483647;' +
            'left:3%;top:3%;width:94%;height:90%;' +
            'box-sizing:border-box;padding:30px;' +
            'overflow:auto;background:#101827;color:white;' +
            'border:3px solid #55ddff;' +
            'font:22px Arial,sans-serif;';

        var title = document.createElement('h1');
        title.textContent = 'CINEMA PLUGIN TEST';
        title.style.color = '#55ddff';

        var result = document.createElement('pre');
        result.style.whiteSpace = 'pre-wrap';
        result.textContent =
            'SUCCESS: JavaScript выполняется.\n\n' +
            'Время: ' + new Date().toISOString() + '\n' +
            'Lampa: ' + typeof window.Lampa + '\n' +
            'appready: ' + String(window.appready) + '\n' +
            'User agent: ' + navigator.userAgent;

        var close = document.createElement('button');
        close.textContent = 'ЗАКРЫТЬ';
        close.style.cssText =
            'font-size:22px;padding:15px 25px;margin-top:20px;';

        close.onclick = function () {
            if (panel.parentNode) {
                panel.parentNode.removeChild(panel);
            }
        };

        panel.appendChild(title);
        panel.appendChild(result);
        panel.appendChild(close);

        (document.body || document.documentElement).appendChild(panel);
    }

    try {
        show();
    } catch (e) {
        try {
            console.error('[CinemaTest]', e);
        } catch (ignore) {}
    }
})();
