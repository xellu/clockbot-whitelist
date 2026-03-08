<script lang="ts">
    export let title: string | null = null;
    export let description: string | null = null;
    export let siteName: string | null = "xellu.xyz";

    export let icon: "default" | "custom" | "customLarge" | "video" | "none" = "default"
    export let iconUrl: string = "";

    export let route: string = "/";
    export let color: string = "#33A4F7";

    export let disable: boolean = false
</script>

{#if !disable}
    <meta name="author" content="Xellu" />
    <meta name="description" content="A Personal blog page and invite-only file hosting" />
    <meta name="keywords" content="blog, posts, xellu, xellu.xyz, file hosting, image hosting, file host, image host" />

    <meta name="title" content="{title}" />

    <meta property="og:url" content="https://xellu.xyz{route}" />
    <meta property="og:type" content="website" />

    <meta content="{color}" data-react-helmet="true" name="theme-color" />
{/if}

{#if title} <meta property="og:title" content="{title}" /> {/if}
{#if description} <meta property="og:description" content="{description}" /> {/if}
{#if siteName} <meta property="og:site_name" content="{siteName}" /> {/if}

{#if icon == "default"}
    <meta property="og:image" content="/favicon.png" />

{:else if icon == "custom"}
    <meta property="og:image" content="{iconUrl}" />

{:else if icon == "customLarge"}
    <meta property="og:image" content="{iconUrl}" />
    <meta name="twitter:card" content="summary_large_image">
{:else if icon == "video"}
    <meta property="og:image" content="{iconUrl}" />
    <meta property="og:image:type" content="video/mp4" />
    <meta property="og:image:width" content="1280" />
    <meta property="og:image:height" content="720" />
{/if}