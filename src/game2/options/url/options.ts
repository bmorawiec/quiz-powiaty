import { flipObject } from "src/utils/flipObject";
import type { GameMode, GameOptions, Guessable, UnitType } from "../types/options";
import { decodeFilters, encodeFilters } from "./filters";

/** Encodes options into a URL hash.
 *  @returns a string in the following format:
 *  #ttggGGmmMMff...
 *  where
 *     tt - encoded `unitType`          mm    - encoded `mode`
 *     gg - encoded `guessFrom`         MM    - encoded `maxQuestions`
 *     GG - encoded `guess`             ff... - encoded filters. Data may be longer than two characters.
 *  If `options.maxQuestions` doesn't equal 5, 10, 15, 20, 30, 40, 50 or Infinity, then it will be encoded as if it
 *  were Infinity. */
export function optionsToURL(options: GameOptions) {
    return "#" + unitTypeToCode[options.unitType]
        + guessableToCode[options.guessFrom]
        + guessableToCode[options.guess]
        + modeToCode[options.mode]
        + maxQuestionsToCode(options.maxQuestions)
        + encodeFilters(options.filters);
}

/** Decodes game data stored in a URL hash.
 *  The value of the provided hash string must match the following format:
 *  #ttggGGmmMMff...
 *  where
 *     tt - encoded `unitType`          mm    - encoded `mode`
 *     gg - encoded `guessFrom`         MM    - encoded `maxQuestions`
 *     GG - encoded `guess`             ff... - encoded filters. Data may be longer than two characters.
 *  @returns `null` if the input doesn't match the correct format. */
export function optionsFromURL(hash: string): GameOptions | null {
    if (hash.length < 11) {
        return null;
    }

    const unitType = unitTypeFromCode[hash.slice(1, 3)];
    const guessFrom = guessableFromCode[hash.slice(3, 5)];
    const guess = guessableFromCode[hash.slice(5, 7)];
    const mode = modeFromCode[hash.slice(7, 9)];
    const maxQuestions = maxQuestionsFromCode(hash.slice(9, 11));
    const filters = decodeFilters(hash.slice(11));
    if (!unitType || !guessFrom || !guess || !mode || !maxQuestions || !filters) {
        return null;
    }

    return {
        mode,
        unitType,
        guessFrom,
        guess,
        maxQuestions,
        filters,
    };
}

const unitTypeToCode: Record<UnitType, string> = {
    county: "36",
    voivodeship: "86",
};

const guessableToCode: Record<Guessable, string> = {
    name: "58",
    capital: "32",
    plate: "95",
    flag: "34",
    coa: "35",
    shape: "94",
};

const modeToCode: Record<GameMode, string> = {
    choiceGame: "ce",
    dndGame: "dd",
    promptGame: "pt",
    typingGame: "tg",
};

const unitTypeFromCode = flipObject(unitTypeToCode);
const guessableFromCode = flipObject(guessableToCode);
const modeFromCode = flipObject(modeToCode);

const maxQuestionsMap: [number, string][] = [
    [5, "05"],
    [10, "10"],
    [15, "15"],
    [20, "20"],
    [30, "30"],
    [40, "40"],
    [50, "50"],
    [Infinity, "99"],
];

function maxQuestionsToCode(maxQuestions: number): string {
    return maxQuestionsMap.find(([m, _c]) => m === maxQuestions)?.[1] || "99";
}

function maxQuestionsFromCode(code: string): number | undefined {
    return maxQuestionsMap.find(([_m, c]) => c === code)?.[0];
}
