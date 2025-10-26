import { voivodeshipIds, type VoivodeshipId } from "src/data/common";
import { unitShapes } from "src/data/unitShapes";
import { Border } from "src/map";

const voivodeshipShapes = unitShapes
    .filter((unitShape) => voivodeshipIds.includes(unitShape.id as VoivodeshipId));

export function VoivodeshipBorders() {
    return voivodeshipShapes.map((shape) =>
        <Border
            key={shape.id}
            shape={shape.outline.hq}
        />
    );
}
