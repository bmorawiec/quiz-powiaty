import { extend } from "@pixi/react";
import { Graphics } from "pixi.js";
import { colors } from "src/utils/colors";
import { useDarkMode } from "src/utils/useDarkMode";

export interface BorderProps {
    /** The shape of this feature as a multipolygon.
     *  Each number[] in the number[][] corresponds to a single polygon.
     *  Each number[] contains alternating x and y coordinates of following points. */
    shape: number[][];
}

extend({
    Graphics,
});

/** A non-interactive empty (non-filled) map feature of the specified shape. */
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
