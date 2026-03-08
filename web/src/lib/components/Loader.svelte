<script lang="ts">
    import { ConicGradient, type ConicStop } from "@skeletonlabs/skeleton";

    export let center: boolean = true;
    
    export let error: string | null = null;
    export let scale: "xs" | "sm" | "md" | "lg" = "md";
    export let variant: "primary" | "secondary" | "tertiary" | "success" | "warning" | "error" = "primary";

    const SIZES = {
        xs: "w-3",
        sm: "w-6",
        md: "w-12",
        lg: "w-24"
    }

    const conicStops: ConicStop[] = [
        { color: 'transparent', start: 0, end: 1 },
        { color: `rgb(var(--color-${variant}-500))`, start: 90, end: 100 }
    ];
</script>

<div class="{center ? 'flex items-center justify-center w-full' : ''}">
    <div class="flex flex-col items-center">
        {#if error == null}
            <ConicGradient stops={conicStops} spin bind:width={SIZES[scale]} />
        
        <!-- error handler -->
        {:else}
            <span class="material-symbols-outlined text-error-500 text-5xl">error</span>
            <p class="text-error-500 opacity-50 font-bold text-xs uppercase my-5">{error}</p>
        {/if}
    </div>
</div>