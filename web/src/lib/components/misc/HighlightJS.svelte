<script lang="ts">
    import hljs from 'highlight.js/lib/core';
    import 'highlight.js/styles/github-dark.css';

    import { storeHighlightJs } from '@skeletonlabs/skeleton';

    import xml from 'highlight.js/lib/languages/xml'; // for HTML
    import css from 'highlight.js/lib/languages/css';
    import json from 'highlight.js/lib/languages/json';
    import javascript from 'highlight.js/lib/languages/javascript';
    import typescript from 'highlight.js/lib/languages/typescript';
    import python from 'highlight.js/lib/languages/python';
    import plaintext from 'highlight.js/lib/languages/plaintext';
    import java from 'highlight.js/lib/languages/java';
    import kotlin from 'highlight.js/lib/languages/kotlin';
    import csharp from 'highlight.js/lib/languages/csharp';
    import cpp from 'highlight.js/lib/languages/cpp';
    import c from 'highlight.js/lib/languages/c';
    import ini from 'highlight.js/lib/languages/ini';
    import markdown from 'highlight.js/lib/languages/markdown';
    import html from 'highlight.js/lib/languages/xml';
    import php from 'highlight.js/lib/languages/php';
    import shell from 'highlight.js/lib/languages/shell';
    import dos from 'highlight.js/lib/languages/dos';

    hljs.registerLanguage('xml', xml); // for HTML
    hljs.registerLanguage('css', css);
    hljs.registerLanguage('json', json);
    hljs.registerLanguage('javascript', javascript);
    hljs.registerAliases(["js", "jsx", "mjs", "cjs"], { languageName: 'javascript' });
    hljs.registerLanguage('typescript', typescript);
    hljs.registerAliases(["ts", "tsx", "mts", "cts"], { languageName: 'typescript' });
    hljs.registerLanguage('python', python);
    hljs.registerAliases(["py", "pyw"], { languageName: 'python' });
    hljs.registerLanguage('plaintext', plaintext);
    hljs.registerAliases(["txt", "text"], { languageName: 'plaintext' });
    hljs.registerLanguage('java', java);
    hljs.registerLanguage('kotlin', kotlin);
    hljs.registerAliases(["kt", "kts"], { languageName: 'kotlin' });
    hljs.registerLanguage('csharp', csharp);
    hljs.registerAliases(["cs", "csharp"], { languageName: 'csharp' });
    hljs.registerLanguage('cpp', cpp);
    hljs.registerAliases(["c++", "cc", "cxx", "hpp", "hxx", "h"], { languageName: 'cpp' });
    hljs.registerLanguage('c', c);
    hljs.registerAliases(["h", "c"], { languageName: 'c' });
    hljs.registerLanguage('ini', ini);
    hljs.registerAliases(["ini", "toml"], { languageName: 'ini' });
    hljs.registerLanguage('markdown', markdown);
    hljs.registerAliases(["md"], { languageName: 'markdown' });
    hljs.registerLanguage('html', html);
    hljs.registerAliases(["html", "htm"], { languageName: 'html' });
    hljs.registerLanguage('php', php);
    hljs.registerAliases(["php", "php3", "php4", "php5", "php7"], { languageName: 'php' });
    hljs.registerLanguage('shell', shell);
    hljs.registerAliases(["sh", "bash", "zsh"], { languageName: 'shell' });
    hljs.registerLanguage('dos', dos);
    hljs.registerAliases(["bat", "cmd"], { languageName: 'dos' });

    storeHighlightJs.set(hljs);
</script>