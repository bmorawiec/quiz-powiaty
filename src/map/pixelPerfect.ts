import type { Vector } from "src/utils/vector";

export function getPixelPerfectPosition(position: Vector, zoom: number): Vector {
    return {
        x: Math.round(position.x * zoom) / zoom,
        y: Math.round(position.y * zoom) / zoom,
    };
}
