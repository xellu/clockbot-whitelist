<script lang="ts">
    import { onMount } from "svelte";

    import { RangeSlider } from '@skeletonlabs/skeleton';
    import { slide } from "svelte/transition";

    import { getFileType, type FileType } from "$lib/files";
    
    type FileLookup = {
        fullName: string,
        originalName: string,
        contentType: string,

        size: number,
        uploadedAt: number,
    }

    export let data: FileLookup;
    let meta: FileType;
    let downloadUrl: string;

    onMount(() => {
        meta = getFileType(data.fullName);
        downloadUrl = `https://xellu.xyz/api/v2/files/${data.fullName}`;
    })
</script>

<div id="contextMenu-{data.fullName}">
    {#if meta?.format == "image"}
        <img src={downloadUrl} alt="" title={data.originalName} class="rounded-lg max-h-96 w-full object-cover glass-dark">

    {:else if meta?.format == "video"}
        <div class="w-full bg-black rounded-lg aspect-video overflow-hidden select-none">
            <video src={downloadUrl} title={data.originalName} class="rounded-lg aspect-video w-full">
                <track kind="captions">        
            </video>

            <div class="relative w-full aspect-video -translate-y-full flex items-center justify-center">
                <span class="material-symbols-outlined p-1 bg-surface-900/50 rounded-full">play_circle</span>
            </div>
        </div>
    {:else if meta?.format == "audio"}
        <div class="glass rounded-lg flex items-center justify-center flex-col aspect-square overflow-hidden select-none">
            <span class="material-symbols-outlined text-7xl text-tertiary-500/75">play_circle</span>

            <p class="text-xs text-tertiary-500 whitespace-nowrap text-ellipsis w-32 md:w-56 text-center overflow-hidden mt-3">{data.originalName}</p>
        </div>
    {:else}
        <div class="glass rounded-lg flex items-center justify-center flex-col aspect-square overflow-hidden select-none">
            <span class="material-symbols-outlined text-7xl text-tertiary-500/75">{meta?.icon}</span>
            <p class="text-xs text-tertiary-500 whitespace-nowrap text-ellipsis w-32 md:w-56 text-center overflow-hidden">{data.originalName}</p>
        </div>
    {/if}

</div>