import type { Vector } from "src/utils/vector";
import type { WorldTransform } from "./worldTransform";

export function getPixelPerfectPosition(position: Vector, tr: WorldTransform): Vector {
    return {
        x: (Math.round(position.x * tr.scale + tr.position.x) - tr.position.x) / tr.scale,
        y: (Math.round(position.y * tr.scale + tr.position.y) - tr.position.y) / tr.scale,
    };
}
