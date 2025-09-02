import type { Vector } from "src/utils/vector";

/** Stores information about an administrative unit. */
export interface Unit {
    /** The TERC code of this administrative unit. */
    id: string;
    type: UnitType;
    /** "county" - this is a regular county.
     *  "city" - this is a city on county rights.
     *
     *  Required for counties.
     *  This field can be filtered by. */
    countyType?: CountyType;
    /** TERC code of the administrative unit this unit is a part of.
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

export type UnitType = "county" | "voivodeship";
export type CountyType = "county" | "city";

export const voivodeshipIds = ["02", "04", "06", "08", "10", "12", "14", "16",
    "18", "20", "22", "24", "26", "28", "30", "32"] as const;
export type VoivodeshipId = (typeof voivodeshipIds)[number];

/** Represents data fields that can be guessed by the player or that can serve as a hint. */
export type Guessable = "name" | "capital" | "plate" | "flag" | "coa" | "map";

/** Stores information about the shape of an administrative unit. */
export interface UnitShape {
    /** The TERC code of this administrative unit. */
    id: string;
    /** The shape of this administrative unit.
     *  The data consists of an array of polygons, which in turn are made up of points.
     *
     *  Formal definition: (P1, P2, ..., Pn)
     *  where Pn represents a polygon and Pn = (x1, y1, x2, y2, ..., xn, yn)
     *  where xn, yn are coordinates of point n. */
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
    outline: number[][];
}
