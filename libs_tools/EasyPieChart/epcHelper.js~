(function () {
"use strict";
    function isOlderIE () {
        return window.attachEvent && !window.addEventListener;
    }
    function addScriptCallback (script, callback) {
        script.onload = function () {
            callback(script);

        };
        script.onreadystatechange = function () {
            if (this.readyState == 'complete') {
                callback(script);
            }
        };
    }
    function loadScript (src, callback) {
        var s = document.createElement('script');
        s.type = 'text/javascript';
        s.src = src;
        if (isOlderIE())
            document.getElementsByTagName('head')[0].appendChild(requireTag);
        else
            document.head.appendChild(s);
        addScriptCallback(s, callback);
    }
    function runPieCharts () {
        var func = window.easyPieChartsFuncs || {},
            key;
        for ( key in func) {
            func[key]();
        }
    }
    function loadEPC () {
        var loadEasyPieChart = function () {
            loadScript('https://cdn.rawgit.com/benbai123/HTML_CSS_Javascript_practice/a96fbac1e816064dcff1ff889d5aff5a03e8b83b/libs_tools/EasyPieChart/resources/EasyPieCheart/dist/jquery.easypiechart.min.js', runPieCharts);
        };
        if (isOlderIE()) { // IE7, 8
            if (!Function.prototype.bind) {
                Function.prototype.bind = function (oThis) {
                    if (typeof this !== "function") {
                        // closest thing possible to the ECMAScript 5 internal IsCallable function
                        throw new TypeError("Function.prototype.bind - what is trying to be bound is not callable");
                    }
                    var aArgs = Array.prototype.slice.call(arguments, 1),
                    fToBind = this,
                    fNOP = function () {},
                    fBound = function () {
                        return fToBind.apply(this instanceof fNOP && oThis ? this : oThis,
                        aArgs.concat(Array.prototype.slice.call(arguments)));
                    };
                    fNOP.prototype = this.prototype;
                    fBound.prototype = new fNOP();
                    return fBound;
                };
            }
            loadScript('https://cdn.rawgit.com/benbai123/HTML_CSS_Javascript_practice/a96fbac1e816064dcff1ff889d5aff5a03e8b83b/libs_tools/EasyPieChart/resources/EasyPieCheart/demo/excanvas.compiled.js', loadEasyPieChart);
        } else {
            loadEasyPieChart();
        }
    }
    function loadJS () {
        if (window.isLoadingEasyPieChart) return;
        window.isLoadingEasyPieChart = true;
        if (!window.jquery)
            loadScript('https://ajax.googleapis.com/ajax/libs/jquery/1.11.2/jquery.min.js', loadEPC);
        else if (!$('<span></span>').easyPieChart)
            loadEPC();
    }
    loadJS ();
})();
