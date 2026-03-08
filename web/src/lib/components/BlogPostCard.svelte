<script lang="ts">
    import { type PostType } from "$lib/scripts/Blog";
    import { toAgo } from "$lib/scripts/Utils";
    
    import { getModalStore, getToastStore } from "@skeletonlabs/skeleton";

    const modal = getModalStore();
    const toast = getToastStore();

    export let post: PostType;
    export let adminTools: boolean = false;
    export let onEdit: (p: PostType) => void = (p: PostType) => {};

    async function onDelete(confirm?: boolean) {
        if (confirm === undefined) {
            return modal.trigger({
                title: "Are you sure?",
                body: `You are about to delete the post "${post.title}". You won't be able to undo this action.`,
                
                modalClasses: "glass-warning",
                type: "confirm",

                buttonTextCancel: "No",
                buttonTextConfirm: "Yes",
                response(r) {
                    onDelete(r);
                },
            })
        }

        if (!confirm) {
            return toast.trigger({
                message: "Action cancelled",
                background: "variant-soft-warning",
            })
        }

        const r = await fetch(`/api/v2/blog/post/${post._id}`, {
            method: "DELETE",
        });

        if (r.ok) {
            toast.trigger({
                message: "Post deleted",
                background: "variant-soft-success",
            })
            window.location.reload();
        } else {
            toast.trigger({
                message: "Failed to delete post",
                background: "variant-soft-error",
            })
        }
    }
</script>

<div class="glass p-3 rounded-xl group max-sm:w-80 mb-3">
    <a href="{post._id == null ? '#' : '/blog/' + post._id}" class="flex flex-col" draggable="false">

        <h2 class="text-lg group-hover:text-tertiary-500 duration-300 font-bold whitespace-nowrap text-ellipsis overflow-hidden">{post.title}</h2>
        <p class="text-sm opacity-70 whitespace-nowrap text-ellipsis overflow-hidden">{post.brief}</p>
    
        <div class="flex items-center justify-between mt-3 text-xs opacity-50">
            <!-- author -->
            <p> By <span class="capitalize font-bold">@{post.author}</span> </p>
            <p>{post.lastModified == null ? `Posted ${toAgo(post.createdAt*1000)}` : `Edited ${toAgo(post.lastModified*1000)}`}</p>
        </div>
    </a>

    {#if adminTools}
        <div class="flex items-center gap-3 h-0 overflow-hidden group-hover:h-12 duration-300">
            <button class="btn btn-sm mt-3 flex items-center justify-center glass-tertiary h-8 text-sm" on:click={() => {
                onEdit(post);
            }}>
                <span class="material-symbols-outlined scale-90">edit</span>
                <span>Edit</span>
            </button>
            <button class="btn btn-sm mt-3 flex items-center justify-center glass-error h-8 text-sm" on:click={() => {
                onDelete();
            }}>
                <span class="material-symbols-outlined scale-90">delete</span>
                <span>Delete</span>
            </button>
        </div>
    {/if}
</div>
