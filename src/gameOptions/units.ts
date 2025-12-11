import type { Unit } from "src/data/common";
import type { GameOptions } from "./types";
import { toShuffled } from "src/utils/random";
import { matchesFilters } from "./filters";

export async function unitsFromOptions(options: GameOptions): Promise<[Unit[], Unit[]]> {
    const { units } = await import("src/data/units");
    const unitsMatchingType = units.filter((unit) => unit.type === options.unitType);
    const unitsMatchingFilters = toShuffled(unitsMatchingType.filter((unit) => matchesFilters(unit, options.filters)));
    const limitedUnits = (options.maxQuestions)
        ? unitsMatchingFilters.slice(0, options.maxQuestions)
        : unitsMatchingFilters;
    return [limitedUnits, unitsMatchingType];
}
