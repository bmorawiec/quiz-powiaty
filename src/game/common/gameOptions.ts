import type { Unit, UnitTag, UnitType } from "src/data";
import type { Guessable } from "src/data";

export type GameType = "choiceGame" | "dndGame" | "mapGame" | "promptGame" | "typingGame";

export interface GameOptions {
    gameType: GameType;
    unitType: UnitType;
    guessFrom: Guessable;
    guess: Guessable;
    filters: UnitFilter[];
}

/** Used to filter units depending on their tags. */
export interface UnitFilter {
    /** The tag to filter for. */
    tag: UnitTag;
    mode: UnitFilterMode;
}

/** "include" - All administrative units with the specified tag will be included.
 *  "exclude" - All administrative units with the specified tag will be excluded. */
export type UnitFilterMode = "include" | "exclude";

/** Returns true if the provided administrative unit matches the specified filters */
export function matchesFilters(unit: Unit, filters: UnitFilter[]): boolean {
    for (const filter of filters) {
        if (filter.mode === "include") {
            if (!unit.tags.includes(filter.tag)) {
                return false;
            }
        } else {
            if (unit.tags.includes(filter.tag)) {
                return false;
            }
        }
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
