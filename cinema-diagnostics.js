
(function () {
    'use strict';

    // Подтверждаем загрузку плагина для Lampa
    window.plugin_cinema_diagnostics_ready = true;

    // Не запускаем повторно
    if (window.__cinema_diag_test_started) return;
    window.__cinema_diag_test_started = true;

    function showTest() {
        if (!document.body) {
            setTimeout(showTest, 100);
            return;
        }

        var panel = document.createElement('div');

        panel.style.cssText =
            'position:fixed;z-index:999999;' +
            'left:5%;top:5%;width:90%;padding:25px;' +
            'box-sizing:border-box;background:#101827;' +
            'color:white;border:3px solid #55ddff;' +
            'font:22px Arial,sans-serif;';

        panel.innerHTML =
            '<h2 style="color:#55ddff">CINEMA TEST OK</h2>' +
            '<p>Плагин подтверждён и JavaScript выполняется.</p>' +
            '<p>Lampa API: ' +
            (window.Lampa ? 'доступен' : 'пока недоступен') +
            '</p>';

        var button = document.createElement('button');
        button.textContent = 'Закрыть';
        button.style.cssText = 'font-size:20px;padding:12px;';
        button.onclick = function () {
            if (panel.parentNode) panel.parentNode.removeChild(panel);
        };

        panel.appendChild(button);
        document.body.appendChild(panel);
    }

    showTest();
})();
