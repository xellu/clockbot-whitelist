<script lang="ts">
    import "../app.pcss"
    import "../markdown.pcss"

    import MouseCircle from "$lib/components/MouseCircle.svelte";
    import HighlightJS from "$lib/components/misc/HighlightJS.svelte";

    import { AutoAuthenticate, AuthLogger } from '$lib/scripts/Auth';

    import { onMount } from "svelte";
    import { getToastStore, initializeStores, Toast, Modal } from "@skeletonlabs/skeleton";

    initializeStores();

    const ICONS = [
        "add",
        "arrow_right_alt",
        "edit",
        "delete",
        "error",
        "open_in_new",
        "cancel_schedule_send",
        "send",
        "check",
        "close",
        "keyboard_arrow_down",
        "expand_more",
        "home",
        "forum",
        "photo_library",
        "settings",
        "colors",
        "cloud_upload",
        "person",
        "upload",
        "folder_open",
        "draft",
        "image",
        "movie",
        "terminal",
        "code_blocks",
        "music_note",
        "package",
        "check_circle",
        "description",
        "download",
        "share",
        "play_arrow",
        "play_circle",
        "stop",
        "stop_circle",
        "pause",
        "pause_circle",
        "volume_up",
        "volume_down",
        "volume_off",
        "help",
        "menu",
        "arrow_outward",
        "arrow_back",
        "music_cast",
        

    ].toSorted();

    const toast = getToastStore();

    onMount(async () => {
        // let auth = await AutoAuthenticate();

        // auth.state.loggedIn ? AuthLogger.ok(`Successfully authenticated (${auth.state.auto})`) : AuthLogger.warn(`Unable to authenticate: ${auth.state.error}`);
        // if (auth.state.error && !auth.state.loggedIn) { //show error message
        //     toast.trigger({
        //         message: auth.state.error,
        //         background: "variant-soft-warning",
        //     })
        // }
    })

</script>

<svelte:head>
    <link
        rel="stylesheet"
        href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200&icon_names={ICONS}"
    />
</svelte:head>

<Toast />
<Modal />
<MouseCircle />
<HighlightJS />

<slot></slot>