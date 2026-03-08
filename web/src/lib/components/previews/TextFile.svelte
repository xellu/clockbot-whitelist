<script lang="ts">
    import Loader from "../Loader.svelte";

    import { onMount } from "svelte";
    import { CodeBlock } from '@skeletonlabs/skeleton';

    import { getFileExtension, getFileType } from "$lib/files";
    
    export let downloadUrl: string;
    export let name: string;

    let content: string = "";
    let fileType: string = getFileExtension(name);

    const SUPPORTED = [
        "xml",
        "css",
        "json",
        "javascript", "js", "jsx", "mjs", "cjs",
        "typescript", "ts", "tsx", "mts", "cts",
        "python", "py", "pyw",
        "plaintext", "txt", "text",
        "java", "kotlin", "kt", "kts",
        "csharp", "cs", 
        "cpp", "c++", "cc", "cxx", "hpp", "hxx", "h",
        "c", "h",
        "ini", "toml",
        "markdown", "md",
        "html", "htm",
        "php", "php3", "php4", "php5", "php7",
        "shell", "sh", "bash", "zsh",
        "dos", "bat", "cmd"
    ]

    onMount(async () => {
        const start: number = Date.now();

        if (!downloadUrl || !name) {
            content = "Required props not provided";
            return;
        }

        if (getFileType(name).format != "text") {
            content = "Unsupported file format";
            return;
        }

        const res = await fetch(downloadUrl);
        if (!res.ok) {
            content = "Failed to fetch file";
            return;
        }

        let size: number = parseInt(res.headers.get('Content-Length') || '0');
        if (size > 1024 * 1024) { //over 1mb
            content = "File too large to preview";
            return;
        }

        setTimeout(() => {
            res.text().then((text) => {
                content = text;
            });
        }, 1000 - (Date.now() - start));

        
    
    });
</script>

<div class="h-full w-full p-3 overflow-scroll">
    {#if content}
        <CodeBlock
            language={fileType}
            code={content}
            lineNumbers={true} 
            
            background="glass-dark"
            button="btn btn-sm glass-tertiary rounded-md w-24"
        />
    {:else}
        <div class="w-full h-full flex items-center justify-center">
            <Loader center={false} variant="tertiary" scale="sm" />
        </div>
    {/if}
</div>