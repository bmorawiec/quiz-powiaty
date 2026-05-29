import type { VoivodeshipCode } from "src/data";

export interface GameFilters {
    /** Matches counties by their types. Matches all counties when empty.
     *  This filter doesn't apply to voivodeships. */
    countyTypes: CountyType[];
    /** Matches counties by their parent voivodeship. Matches all counties when empty.
     *  This filter doesn't apply to voivodeships. */
    voivodeships: VoivodeshipCode[];
}

export type CountyType =
    | "cityCounty"      /** This tag will match counties tagged with the `cityCounty` tag. */
    | "landCounty";     /** This tag will match counties tagged with the `landCounty` tag. */
