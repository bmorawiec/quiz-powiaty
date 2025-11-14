import type { Vector } from "src/utils/geometry";

/** Stores information about an administrative unit. */
export interface Unit {
    /** The id of this administrative unit. */
    id: string;
    type: UnitType;
    /** Required for counties.
     *  This field can be filtered by. */
    countyType?: CountyType;
    /** Id of the administrative unit this unit is a part of.
     *  Required for counties.
     *  This field can be filtered by. */
    parent?: VoivodeshipId;
    /** Whether or not there is another administrative unit with the same name. */
    duplicate?: boolean;
    /** The name of this administrative unit.
     *  In case of a county, this is the county name without the "powiat " prefix. 
     *  In case of a voivodeship, this is the voivodeship name without the "województwo " prefix. */
    name: string;
    /** List of capitals of this administrative unit */
    capitals: string[];
    /** Vehicle registration plates used for this administrative unit */
    plates: string[];
    /** The estimated population of this administrative unit. */
    population: number;
    /** The estimated population density of this administrative unit. */
    density: number;
}

export const unitTypes = ["county", "voivodeship"] as const;
export type UnitType = (typeof unitTypes)[number];

export function isUnitType(maybeUnitType: unknown): maybeUnitType is UnitType {
    return unitTypes.includes(maybeUnitType as UnitType);
}

/** "county" - this unit is a regular county.
 *  "city" - this unit is a city on county rights. */
export const countyTypes = ["county", "city"];
export type CountyType = "county" | "city";

export function isCountyType(maybeCountyType: unknown): maybeCountyType is CountyType {
    return countyTypes.includes(maybeCountyType as CountyType);
}

export const voivodeshipIds = [
    "02", "04", "06", "08", "10", "12", "14", "16",
    "18", "20", "22", "24", "26", "28", "30", "32"
] as const;
export type VoivodeshipId = (typeof voivodeshipIds)[number];

export function isVoivodeshipId(maybeVoivodeshipId: unknown): maybeVoivodeshipId is VoivodeshipId {
    return voivodeshipIds.includes(maybeVoivodeshipId as VoivodeshipId);
}

/** Represents data fields that can be guessed by the player or that can serve as a hint. */
export const guessables = ["name", "capital", "plate", "flag", "coa", "map"] as const;
export type Guessable = (typeof guessables)[number];

export function isGuessable(maybeGuessable: unknown): maybeGuessable is Guessable {
    return guessables.includes(maybeGuessable as Guessable);
}

/** Stores information about the shape of an administrative unit. */
export interface UnitShape {
    /** The id of this administrative unit. */
    id: string;
    /** The shape of this administrative unit as a multipolygon.
     *  Each number[] in the number[][] corresponds to a single polygon.
     *  Each number[] contains alternating x and y coordinates of following points. */
    outline: {
        lq: number[][];
        hq: number[][];
    };
    /** The center of this administrative unit. */
    center: Vector;
}

/** Stores information about the shape of a country */
export interface CountryShape {
    /** The ISO 3166-1 alpha-2 code of this country. */
    id: string;
    /** The shape of this country as a multipolygon.
     *  Each number[] in the number[][] corresponds to a single polygon.
     *  Each number[] contains alternating x and y coordinates of following points. */
    outline: number[][];
}
