<script lang="ts">
    export let style: string = "";

    export let from: string = "from-primary-500";
    export let to: string = "to-secondary-500";
</script>

<span class=" bg-gradient-to-br {from} {to} bg-clip-text text-transparent {style}">
    <slot />
</span>