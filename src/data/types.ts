/** Stores information about an administrative unit. */
export interface Unit {
    /** The TERC code of this administrative unit. */
    id: string;
    /** TERC code of the administrative unit this unit is a part of.
     *  Required for counties. */
    parent?: string;
    /** Used for filtering administrative units. */
    tags: UnitTag[];
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

/** "county" - This administrative unit is a county.
 *  "voivodeship" - This administrative unit is a voivodeship.
 *
 *  "city" - This administrative unit is a city with county rights.
 *
 *  "voiv-XX" - This administrative unit is within a voivodeship with the specified code. */
export type UnitTag = (typeof UNIT_TAGS)[number];
export const UNIT_TAGS = [ "county", "voivodeship", "city",
    "voiv-DS", "voiv-KP", "voiv-LU", "voiv-LB", "voiv-LD", "voiv-MA", "voiv-MZ", "voiv-OP",
    "voiv-PK", "voiv-PD", "voiv-PM", "voiv-SL", "voiv-SK", "voiv-WN", "voiv-WP", "voiv-ZP" ] as const;

/** Represents data fields that can be guessed by the player or that can serve as a hint. */
export type Guessable = "name" | "capital" | "plate" | "flag" | "coa" | "map";
