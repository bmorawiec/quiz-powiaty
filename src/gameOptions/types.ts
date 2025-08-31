import { type CountyType, type Guessable, type Unit, type UnitType, type VoivodeshipId } from "src/data/common";

export class InvalidGameOptionsError extends Error {
    name = "InvalidGameOptionsError";

    constructor() {
        super("Invalid game options.");
    }
}

export type GameType = "choiceGame" | "dndGame" | "mapGame" | "promptGame" | "typingGame";

export interface GameOptions {
    gameType: GameType;
    unitType: UnitType;
    guessFrom: Guessable;
    guess: Guessable;
    filters: UnitFilters;
}

/** Used to filter counties depending on their types and/or the voivodeships they're a part of.
 *  Currently there are no filters that affect voivodeships. */
export interface UnitFilters {
    /** Contains types of counties to match. 
     *  If empty, then all counties are matched. Only affects counties. */
    countyTypes: CountyType[];
    /** Contains voivodeship TERC codes to match children of.
     *  If empty, then all counties are matched. Only affects counties. */
    voivodeships: VoivodeshipId[];
}

/** "include" - All administrative units with the specified tag will be included.
 *  "exclude" - All administrative units with the specified tag will be excluded. */
export type UnitFilterMode = "include" | "exclude";

/** Returns true if the provided administrative unit matches the specified filters */
export function matchesFilters(unit: Unit, filters: UnitFilters): boolean {
    if (unit.type === "county") {
        return (filters.countyTypes.length === 0 || filters.countyTypes.includes(unit.countyType!))
            && (filters.voivodeships.length === 0 || filters.voivodeships.includes(unit.parent!));
    }
    return true;
}

export type ValidOptions = {
    [TGuessFrom in Guessable]?: {
        [TGuess in Guessable]?: "voivodeship" | "county" | "*";
    };
};

export function validateOptions(options: GameOptions, validOptions: ValidOptions): boolean {
    const constraint =  validOptions[options.guessFrom]?.[options.guess];
    if (!constraint) {
        return false;
    }
    return constraint === "*" || options.unitType === constraint;
}
