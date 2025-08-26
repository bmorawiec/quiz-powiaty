import { extend } from "@pixi/react";
import { Graphics } from "pixi.js";
import { useCallback, useState } from "react";
import { colors } from "src/utils/colors";

export interface FeatureProps {
    shape: number[][];
}

extend({
    Graphics,
});

export function Feature({ shape }: FeatureProps) {
    const [hover, setHover] = useState(false);

    const handlePointerOver = () => {
        setHover(true);
    };

    const handlePointerOut = () => {
        setHover(false);
    };

    const redraw = useCallback((g: Graphics) => {
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
        g.fill({
            color: (hover) ? colors.teal15 : colors.grass10,
        });
        g.stroke({
            width: (hover) ? 2 : 1,
            join: "round",
            color: colors.teal90,
        });
    }, [hover, shape]);

    return (
        <pixiGraphics
            eventMode="static"
            draw={redraw}
            onPointerOver={handlePointerOver}
            onPointerOut={handlePointerOut}
        />
    );
}
