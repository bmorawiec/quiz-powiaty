import { useTick } from "@pixi/react";
import { Graphics, Ticker } from "pixi.js";
import { useCallback, useRef } from "react";
import { colors } from "src/utils/colors";
import type { Vector } from "src/utils/geometry";

export interface RippleProps {
    center: Vector;
}

const ANIM_LENGTH_MS = 2000;
const MAX_RADIUS = 1000;
const MAX_STROKE_WIDTH = 15;

/** Helps the player find a unit on the map by showing an animated ripple around it. */
export function Ripple({ center }: RippleProps) {
    const graphics = useRef<Graphics | null>(null);
    const time = useRef(0);

    const animate = useCallback((ticker: Ticker) => {
        time.current = (time.current + ticker.deltaMS) % ANIM_LENGTH_MS;

        const g = graphics.current;
        if (g) {
            g.clear();

            const t = time.current / ANIM_LENGTH_MS;
            const y = (1 - Math.cos(Math.PI * t)) / 2;
            const radius = MAX_RADIUS * y;
            const strokeWidth = MAX_STROKE_WIDTH * Math.sin(Math.PI * y);

            g.circle(0, 0, radius);
            g.stroke({
                width: strokeWidth,
                color: colors.teal70,
            });
        }
    }, []);
    useTick(animate);

    return (
        <pixiGraphics
            ref={graphics}
            position={center}
            draw={() => {}}
            zIndex={99_999}
        />
    );
}
