<script lang="ts">
    import { getToastStore } from "@skeletonlabs/skeleton";
    import { slide } from "svelte/transition";

    import { Authenticate } from "$lib/scripts/Auth";
    import { getFileType } from "$lib/files";

    const toast = getToastStore();

    let file: File | null = null;
    let icon: string = "draft";

    let progress: number = -1;


    

    function handleClickEvent() {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = '*';
        input.onchange = (e) => {
            file = input.files?.[0] || null;
            icon = getFileType(file?.name || '').icon;

            try { upload() }
            catch (e) { 
                progress = -1;
                toast.trigger({
                    message: "Upload failed",
                    background: "variant-soft-error"
                })
            }

            input.remove();
        }

        input.click();
    }

    async function upload() {
        if (!file) return;

        const formData = new FormData();
        formData.append('file', file);

        const xhr = new XMLHttpRequest();
        xhr.open('POST', `/api/v2/files/upload`, true);

        xhr.upload.onprogress = (event) => {
            if (event.lengthComputable) {
                progress = (event.loaded / event.total) * 100;
            }
        };

        xhr.onload = () => {
            const data = JSON.parse(xhr.responseText);
            if (xhr.status >= 200 && xhr.status < 300) {
                setTimeout(() => {
                    progress = -1;
                    file = null;
                }, 1000);
                
                try {
                    navigator.clipboard.writeText(data.url);
                    toast.trigger({
                        message: "Link copied to clipboard",
                        background: "variant-soft-success"
                    });
                } catch (e) {
                    toast.trigger({
                        message: "File uploaded",
                        background: "variant-soft-success",

                        action: {
                            label: "Copy link",
                            response: () => {
                                navigator.clipboard.writeText(data.url);
                                toast.trigger({
                                    message: "Link copied to clipboard",
                                    background: "variant-soft-success"
                                });
                            }
                        }
                    })
                }

                Authenticate(true);
            } else {
                setTimeout(() => {
                    progress = -1;
                    file = null;
                }, 1000);
                toast.trigger({
                    message: data.error || "Upload failed",
                    background: "variant-soft-error"
                });
            }
        };

        xhr.onerror = () => {
            setTimeout(() => {
                progress = -1;
                file = null;
            }, 1000);
            toast.trigger({
                message: "Upload failed",
                background: "variant-soft-error"
            });
        };

        xhr.send(formData);
    }
</script>

<button class="glass rounded-xl p-3 flex flex-col group items-center justify-center cursor-pointer w-full h-56"
    on:drop={(e) => {
        if (progress !== -1) return;
        if (!e.dataTransfer?.files) return;

        e.preventDefault();
        file = e.dataTransfer?.files[0] || null;
        icon = getFileType(file?.name || '').icon;

        try { upload() }
        catch (e) { 
            progress = -1;
            file = null;
            toast.trigger({
                message: "Upload failed",
                background: "variant-soft-error"
            })
        }
    }}
    on:dragover={(e) => e.preventDefault()}
    on:click={() => {
        if (progress !== -1) return;
        handleClickEvent();
    }}
>
    <span class="material-symbols-outlined text-5xl opacity-70 group-hover:opacity-100 duration-300">
        {file ? icon : 'upload'}
    </span>
    <p class="uppercase text-xs opacity-70 group-hover:opacity-100 duration-300 max-w-72 overflow-hidden text-ellipsis whitespace-nowrap mt-3">
        {file ? file.name : 'Drag and drop files here to upload'}
    </p>
    {#if progress >= 0}
    <div class="w-full bg-surface-400/50 rounded-full overflow-hidden mt-2" transition:slide>
        <div class="{progress == 100 ? 'bg-success-500 animate-pulse' : 'bg-primary-500'} h-1.5 duration-150 rounded-full min-w-1.5" style="width: {Math.round(progress)}%"></div>
    </div>

    {/if}
</button>