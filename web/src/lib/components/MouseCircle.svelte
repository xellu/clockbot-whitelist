<script lang="ts">
    import { onMount } from "svelte";
    import { type CircleConfigType, CircleConfig  } from "$lib/stores/MouseCircle";

    let config: CircleConfigType = {
        hidden: false,
        radius: 600,
        color: "var(--color-primary-500)",
    }

    CircleConfig.subscribe(value => {
        config = value;
    })

    function onMove(event: MouseEvent) {
        let circle = document.getElementById("circle");
        if (!circle) {
            return console.info("circle not found");
        }
        
        let x = event.clientX - (circle.clientWidth / 2);
        let y = event.clientY - (circle.clientHeight / 2);

        if (x < 0) x = 0;
        if (y < 0) y = 0;
        if (x + circle.clientWidth > window.innerWidth) x = window.innerWidth - circle.clientWidth;
        if (y + circle.clientHeight > window.innerHeight) y = window.innerHeight - circle.clientHeight;

        circle.style.left = x + "px";
        circle.style.top = y + "px";
    }

    onMount(() => {
        document.body.addEventListener("mousemove", onMove);
    })    
</script>

<div id="circle"
    class="{config.hidden ? 'hidden' : 'max-lg:hidden'} bg-black absolute -top-[5000px] left-1/2 rounded-full -z-20 duration-150"
    style="background: radial-gradient(circle, rgba(var(--color-primary-500) / 0.2) 0%, rgba(var(--color-primary-500) / 0) 70%); width: {config.radius}px; height: {config.radius}px;"
></div>