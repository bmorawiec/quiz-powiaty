import { createContext } from "react";
import type { Vector } from "src/utils/vector";

export interface WorldTransform {
    position: Vector;
    scale: number;
}

export const WorldTransformContext = createContext<WorldTransform>({
    position: { x: 0, y: 0 },
    scale: 1,
});
