import type { Unit } from "./types";

export function getUnambiguousName(unit: Unit): string {
    if (unit.type === "county" && unit.duplicate) {
        return unit.name + " (" + unit.capitals.join(", ") + ")";
    }
    return unit.name;
}
