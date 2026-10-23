
(function () {
    if (window.cinemaDiagTest) return;
    window.cinemaDiagTest = true;

    function show() {
        var old = document.getElementById('cinema-diag-test');
        if (old) old.remove();

        var box = document.createElement('div');
        box.id = 'cinema-diag-test';
        box.style.cssText =
            'position:fixed;z-index:999999;top:8%;left:5%;' +
            'width:80%;padding:24px;background:#101a2b;color:white;' +
            'font:24px Arial;border:3px solid #72d5ff;border-radius:12px';
        box.innerHTML =
            '<h2>Cinema Diagnostics TEST</h2>' +
            '<p>Плагин исполняется!</p>' +
            '<p>Lampa: ' + (typeof window.Lampa) + '</p>' +
            '<button id="cinema-diag-close" style="font-size:22px;padding:10px">Закрыть</button>';

        document.body.appendChild(box);
        document.getElementById('cinema-diag-close').onclick = function () {
            box.remove();
        };
    }

    function start() {
        setTimeout(show, 3000);
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', start);
    } else {
        start();
    }
})();
