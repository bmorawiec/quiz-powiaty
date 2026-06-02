import {
    fetchCounties,
    fetchCountyProperties,
    fetchVoivodeshipProperties,
    fetchVoivodeships,
    type PropertyTag,
    type Unit,
} from "src/data";
import type { GameOptions } from "../types";

export function fetchUnits(options: GameOptions) {
    if (options.unitType === "county") {
        return fetchCounties(options.filters.voivodeships);
    } else {
        return fetchVoivodeships();
    }
}

export function fetchUnitsFromAllVoivodeships(options: GameOptions) {
    if (options.unitType === "county") {
        return fetchCounties([]);
    } else {
        return fetchVoivodeships();
    }
}

export function fetchProperties(options: GameOptions, tags: PropertyTag[]) {
    if (options.unitType === "county") {
        return fetchCountyProperties(options.filters.voivodeships, tags);
    } else {
        return fetchVoivodeshipProperties(tags);
    }
}

export function fetchPropertiesFromAllVoivodeships(options: GameOptions, tags: PropertyTag[]) {
    if (options.unitType === "county") {
        return fetchCountyProperties([], tags);
    } else {
        return fetchVoivodeshipProperties(tags);
    }
}

export function filterByCountyType(units: Unit[], options: GameOptions): Unit[] {
    if (options.unitType === "voivodeship" || options.filters.countyTypes.length === 0) {
        return units;
    } else {
        return units.filter((unit) =>
            options.filters.countyTypes.some((countyType) => unit.tags.includes(countyType)));
    }
}
