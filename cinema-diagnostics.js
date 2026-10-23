
(function () {
    if (window.cinemaDiagV2) return;
    window.cinemaDiagV2 = true;

    function show() {
        var L = window.Lampa;
        var lines = [];

        lines.push('Lampa: ' + typeof L);

        if (L) {
            var keys = Object.keys(L).sort();

            lines.push('');
            lines.push('=== MODULES (' + keys.length + ') ===');

            keys.forEach(function (key) {
                var value;
                try {
                    value = L[key];
                    lines.push(
                        key + ': ' +
                        (value === null ? 'null' : typeof value) +
                        (value && typeof value === 'object'
                            ? ' [' + Object.keys(value).slice(0, 12).join(', ') + ']'
                            : '')
                    );
                } catch (e) {
                    lines.push(key + ': [error]');
                }
            });
        }

        var old = document.getElementById('cinema-diag-v2');
        if (old) old.remove();

        var box = document.createElement('div');
        box.id = 'cinema-diag-v2';
        box.style.cssText =
            'position:fixed;z-index:999999;top:2%;left:2%;' +
            'width:94%;height:94%;box-sizing:border-box;' +
            'padding:16px;background:#101a2b;color:white;' +
            'font:16px monospace;overflow:auto;white-space:pre-wrap;' +
            'word-break:break-word;border:2px solid #72d5ff';

        var output = document.createElement('pre');
        output.style.cssText =
            'white-space:pre-wrap;word-break:break-word;margin:0';
        output.textContent = lines.join('\n');

        var close = document.createElement('button');
        close.textContent = 'ЗАКРЫТЬ';
        close.style.cssText = 'font-size:20px;padding:10px;margin-top:12px';
        close.onclick = function () {
            box.remove();
        };

        box.appendChild(output);
        box.appendChild(close);
        document.body.appendChild(box);
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
