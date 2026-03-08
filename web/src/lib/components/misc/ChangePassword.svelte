<script lang="ts">
    import UcHeading from "$lib/components/UCHeading.svelte";

    import { fade, scale } from "svelte/transition";
    import { getModalStore, getToastStore } from "@skeletonlabs/skeleton";
 
    const modal = getModalStore();
    const toast = getToastStore();

    export let open: boolean = false;

    async function changePassword() {
        const r = await fetch(`/api/v2/account/password`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                password: form.password,
                newPassword: form.newPassword
                
            })
        });

        form.password = "";

        if (r.ok) {
            form.newPassword = "";
            
            toast.trigger({
                message: "Username changed successfully",
                background: "variant-soft-success"
            });
            open = false;
        } else {
            let data = await r.json();
            toast.trigger({
                message: data.error || "An error occurred",
                background: "variant-soft-error"
            });
        }

    }

    const form = {
        password: "",
        newPassword: "",
        loading: false
    }
</script>

{#if open}
<div class="fixed w-full h-screen bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 top-0 left-0" transition:fade>
    <div class="glass rounded-xl p-3 flex flex-col gap-3 md:max-w-sm md:w-full" transition:scale>
        <UcHeading>Change Password</UcHeading>

        <input type="password" class="glass-input" bind:value={form.newPassword} placeholder="New Password" />
        <input type="password" class="glass-input" bind:value={form.password} placeholder="Current Password" />

        <div class="flex gap-3">
            <button
                class="btn btn-sm glass-error"
                on:click={async () => {
                    form.loading = true;
                    try { await changePassword() } catch (e) { console.error(e) }
                    form.loading = false;
                }}
                disabled={form.loading}
            >Change</button>
            
            <button class="btn btn-sm glass" on:click={() => {
                open = false    
                form.newPassword = "";
                form.password = "";
            }}>Cancel</button>
        </div>
    </div>
</div>
{/if}