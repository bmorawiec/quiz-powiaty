import type { Unit } from "./types";

/** For units with duplicate names returns a string in the following format: "name (capital name(s))".
 *  Otherwise returns the name of the provided unit. */
export function getUnambiguousName(unit: Unit): string {
    if (unit.type === "county" && unit.duplicate) {
        return unit.name + " (" + unit.capitals.join(", ") + ")";
    }
    return unit.name;
}
