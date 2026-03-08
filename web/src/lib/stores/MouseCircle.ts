import { writable, type Writable } from "svelte/store";

type CircleConfigType = {
    hidden: boolean,
    radius: number,
    color: string,
}

const CircleConfig: Writable<CircleConfigType> = writable<CircleConfigType>({hidden: false, radius: 600, color: "var(--color-primary-500)" })

export {
    type CircleConfigType,
    CircleConfig
};

function SetRadius(radius: number) {
    CircleConfig.update(c => {
        c.radius = radius;
        return c;
    })
}

function SetColor(color: string) {
    CircleConfig.update(c => {
        c.color = color;
        return c;
    })
}

export {
    SetRadius,
    SetColor
};