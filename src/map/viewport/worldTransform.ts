import { createContext } from "react";
import type { Vector } from "src/utils/vector";

/** Describes the transformation applied to a map.
 *  Pv = Pm * tr.scale + tr.position
 *  where
 *      Pv - vector containing map coords
 *      Pm - vector containing position relative to the viewport
 *      tr - a WorldTransform object */
export interface WorldTransform {
    position: Vector;
    scale: number;
}

export const WorldTransformContext = createContext<WorldTransform>({
    position: { x: 0, y: 0 },
    scale: 1,
});
