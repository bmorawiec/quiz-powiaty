import type { Unit } from "src/data/common";
import type { UnitFilters } from "./types";

export function matchesFilters(unit: Unit, filters: UnitFilters): boolean {
    return matchesVoivodeshipFilters(unit, filters) && matchesOtherFilters(unit, filters);
}

export function areFiltersEmpty(filters: UnitFilters): boolean {
    return filters.countyTypes.length === 0 && filters.voivodeships.length === 0;
}

/** Checks whether the provided administrative unit matches filters other than the voivodeship filters. */
export function matchesOtherFilters(unit: Unit, filters: UnitFilters): boolean {
    if (unit.type === "county") {
        return filters.countyTypes.length === 0 || filters.countyTypes.includes(unit.countyType!);
    }
    return true;
}

/** Returns true if the provided administrative unit matches the voivodeships selected in the specified filters */
export function matchesVoivodeshipFilters(unit: Unit, filters: UnitFilters): boolean {
    if (unit.type === "county") {
        return filters.voivodeships.length === 0 || filters.voivodeships.includes(unit.parent!);
    }
    return true;
}
