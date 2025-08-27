import { extend } from "@pixi/react";
import { Graphics } from "pixi.js";
import { colors } from "src/utils/colors";
import { useDarkMode } from "src/utils/useDarkMode";

export interface BorderProps {
    shape: number[][];
}

extend({
    Graphics,
});

export function Border({ shape }: BorderProps) {
    const isDarkMode = useDarkMode();

    const redraw = (g: Graphics) => {
        g.clear();
        g.beginPath();
        for (const polygon of shape) {
            for (let index = 0; index < polygon.length; index += 2) {
                const x = polygon[index];
                const y = polygon[index + 1];
                if (index === 0) {
                    g.moveTo(x, y);
                } else {
                    g.lineTo(x, y);
                }
            }
        }
        g.closePath();
        g.stroke({
            width: 3,
            join: "round",
            color: (isDarkMode)
                ? colors.gray25
                : colors.teal90,
        });
    };

    return (
        <pixiGraphics
            draw={redraw}
        />
    );
}
