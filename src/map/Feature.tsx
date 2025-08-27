import { extend } from "@pixi/react";
import { Graphics } from "pixi.js";
import { useCallback, useState } from "react";
import { colors } from "src/utils/colors";
import { useDarkMode } from "src/utils/useDarkMode";

export interface FeatureProps {
    shape: number[][];
    onPointerOver?: () => void;
    onPointerOut?: () => void;
}

extend({
    Graphics,
});

export function Feature({ shape, onPointerOver, onPointerOut }: FeatureProps) {
    const [hover, setHover] = useState(false);

    const handlePointerOver = () => {
        setHover(true);
        onPointerOver?.();
    };

    const handlePointerOut = () => {
        setHover(false);
        onPointerOut?.();
    };

    const isDarkMode = useDarkMode();

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
            color: (isDarkMode)
                ? (hover) ? colors.gray80 : colors.gray90
                : (hover) ? colors.teal15 : colors.grass10,
        });
        g.stroke({
            width: (hover) ? 2 : 1,
            join: "round",
            color: (isDarkMode) ? colors.gray10 : colors.teal90,
        });
    }, [hover, shape, isDarkMode]);

    return (
        <pixiGraphics
            eventMode="static"
            draw={redraw}
            onPointerOver={handlePointerOver}
            onPointerOut={handlePointerOut}
        />
    );
}
