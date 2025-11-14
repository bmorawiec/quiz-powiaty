import type { Vector } from "src/utils/vector";
import type { WorldTransform } from "./worldTransform";

/** Rounds the specified map coordinates, so that graphics rendered at this position doesn't get blurred because of
 *  antialiasing. */
export function getPixelPerfectPosition(position: Vector, tr: WorldTransform): Vector {
    return {
        x: (Math.round(position.x * tr.scale + tr.position.x) - tr.position.x) / tr.scale,
        y: (Math.round(position.y * tr.scale + tr.position.y) - tr.position.y) / tr.scale,
    };
}
