import { type CountyType, type VoivodeshipId, isCountyType, isVoivodeshipId } from "src/data/common";

/** Used to filter counties depending on their types and/or the voivodeships they're a part of.
 *  Currently there are no filters that affect voivodeships. */
export interface UnitFilters {
    /** Matches counties by their types.
     *  Matches all counties when empty. */
    countyTypes: CountyType[];
    /** Matches counties by their parent voivodeship.
     *  Matches all counties when empty. */
    voivodeships: VoivodeshipId[];
}

export function isUnitFilters(maybeFilters: unknown): maybeFilters is UnitFilters {
    return typeof maybeFilters === "object"
        && maybeFilters !== null
        && Array.isArray((maybeFilters as UnitFilters).countyTypes)
        && (maybeFilters as UnitFilters).countyTypes
            .every((maybeCountyType) => isCountyType(maybeCountyType))
        && Array.isArray((maybeFilters as UnitFilters).voivodeships)
        && (maybeFilters as UnitFilters).voivodeships
            .every((maybeVoivodeshipId) => isVoivodeshipId(maybeVoivodeshipId));
}
