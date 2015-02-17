(function () {
"use strict";
    var baseUrl = '://cdn.rawgit.com/benbai123/HTML_CSS_Javascript_practice/7e1d5d3a459e88b41754e668804db5d8dcd9a68c/libs_tools/SyntaxHighlighter/resources/3.0.83/scripts/',
        baseCssUrl = '://cdn.rawgit.com/benbai123/HTML_CSS_Javascript_practice/7e1d5d3a459e88b41754e668804db5d8dcd9a68c/libs_tools/SyntaxHighlighter/resources/3.0.83/styles/',
        brushMapping = {
            'as3': 'shBrushAS3.js', 'actionscript3': 'shBrushAS3.js',
            'bash': 'shBrushBash.js', 'shell': 'shBrushBash.js',
            'cf': 'shBrushColdFusion.js', 'coldfusion': 'shBrushColdFusion.js',
            'c-sharp': 'shBrushCSharp.js', 'csharp': 'shBrushCSharp.js',
            'cpp': 'shBrushCpp.js', 'c': 'shBrushCpp.js',
            'css': 'shBrushCss.js',
            'delphi': 'shBrushDelphi.js', 'pas': 'shBrushDelphi.js', 'pascal': 'shBrushDelphi.js',
            'diff': 'shBrushDiff.js', 'patch': 'shBrushDiff.js',
            'erl': 'shBrushErlang.js', 'erlang': 'shBrushErlang.js',
            'groovy': 'shBrushGroovy.js',
            'js': 'shBrushJScript.js', 'jscript': 'shBrushJScript.js', 'javascript': 'shBrushJScript.js',
            'java': 'shBrushJava.js',
            'jfx': 'shBrushJavaFX.js', 'javafx': 'shBrushJavaFX.js',
            'perl': 'shBrushPerl.js', 'pl': 'shBrushPerl.js',
            'php': 'shBrushPhp.js',
            'plain': 'shBrushPlain.js', 'text': 'shBrushPlain.js',
            'ps': 'shBrushPowerShell.js', 'powershell': 'shBrushPowerShell.js',
            'py': 'shBrushPython.js', 'python': 'shBrushPython.js',
            'rails': 'shBrushRuby.js', 'ror': 'shBrushRuby.js', 'ruby': 'shBrushRuby.js',
            'scala': 'shBrushScala.js',
            'sql': 'shBrushSql.js',
            'vb': 'shBrushVb.js', 'vbnet': 'shBrushVb.js',
            'xml': 'shBrushXml.js', 'xhtml': 'shBrushXml.js', 'xslt': 'shBrushXml.js', 'html': 'shBrushXml.js'
        };
    function getProtocol () {
        var protocol = window.location.protocol;
        protocol = (protocol == 'https'? 'https' : 'http');
        return protocol;
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
        var start = getProtocol(),
            s = document.createElement('script');
        src = start+src;
        s.type = 'text/javascript';
        s.src = src;
        document.head.appendChild(s);
        addScriptCallback(s, callback);
    }
    function loadRequiredScript () {
        var $pres = $('pre'),
            key,
            js = {},
            wait = [],
            start = getProtocol();
        $('pre').each(function () {
            // roughly detect
            var $self = $(this),
                hasBrush = $self.attr('class').indexOf('brush') >= 0;
            if (!hasBrush) return;
            for (key in brushMapping) {
                if ($self.hasClass(key)) {
                    js[key] = brushMapping[key];
                }
            }
        });

        loadScript(baseUrl+'shCore.js', function (readySrc) {
            var $head = $(document.head);
            $head.append('<link href="'+start+baseCssUrl+'shCore.css" rel="stylesheet" type="text/css" />'
                    +'<link href="'+start+baseCssUrl+'shThemeDefault.css" rel="stylesheet" type="text/css" />');
            for (key in js) {
                var src = baseUrl+js[key];
                wait.push(src);

                loadScript(src, function (readySrc) {
                    wait.splice(wait.indexOf(readySrc), 1)
                    if (!wait.length) {
                        var settings = window.syntaxHighlighterConfig,
                            themesString = '';
                        if (settings) {
                            var item,
                                config = settings.config || {},
                                defaults = settings.defaults || {},
                                themes = settings.themes || {};
                            for (item in config) {
                                SyntaxHighlighter.config[item] = config[item];
                            }
                            for (item in defaults) {
                                SyntaxHighlighter.defaults[item] = defaults[item];
                            }
                            for (item in themes) {
                                themesString += '<link href="'+start+baseCssUrl+themes[item]+'" rel="stylesheet" type="text/css" />';
                            }
                            if (themesString) {
                                $head.append(themesString);
                            }
                        }
                        SyntaxHighlighter.all()
                    }
                });
            }
        });
    }
    function loadJS () {
        loadScript('://ajax.googleapis.com/ajax/libs/jquery/1.11.2/jquery.min.js', loadRequiredScript);
    }
    loadJS();
})();
