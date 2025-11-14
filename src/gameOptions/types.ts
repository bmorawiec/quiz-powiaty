import { isGuessable, isUnitType, type Guessable, type UnitType } from "src/data/common";
import { type UnitFilters, isUnitFilters } from "./filters";

export class InvalidGameOptionsError extends Error {
    name = "InvalidGameOptionsError";

    constructor() {
        super("Invalid game options.");
    }
}

/** "choiceGame" - multiple choice test
 *  "dndGame" - drag and drop answers to their corresponding questions
 *  "mapGame" - find the specified feature on the map
 *  "promptGame" - type in answers to prompts
 *  "typingGame" - fill in the table */
export const gameTypes = ["choiceGame", "dndGame", "mapGame", "promptGame", "typingGame"] as const;
export type GameType = (typeof gameTypes)[number];

export function isGameType(maybeGameType: unknown): maybeGameType is GameType {
    return gameTypes.includes(maybeGameType as GameType);
}

/** Stores the configuration of a game.
 *  The following chart shows valid `gameType` values based on the values of `guess` and `guessFrom`.
 *
 *                      guess
 *                      name    cap.    plate   flag    coa     map
 *  guessFrom   name            CDPT    CDPT    CD      CD      M
 *              cap.    CDPT            CDPT    CD      CD      M
 *              plate   CDPT    CDPT            CD      CD      M
 *              flag    CDPT    CDPT    CDPT            CD      M
 *              coa     CDPT    CDPT    CDPT    CD              M
 *              map     CDPT    CDPT    CDPT    CD      CD
 *
 *  where
 *      cap. - capital
 *      C - choiceGame
 *      D - dndGame
 *      M - mapGame
 *      P - promptGame
 *      T - typingGame
 */
export interface GameOptions {
    gameType: GameType;
    /** Whether the questions are about voivodeships or counties. */
    unitType: UnitType;
    /** The property that the player will guess based on. */
    guessFrom: Guessable;
    /** The property that will be guessed by the player. */
    guess: Guessable;
    /** Maximum amount of questions in this game. */
    maxQuestions: number | null;
    /** Filters to apply to units when creating questions based on them. */
    filters: UnitFilters;
}

export function isGameOptions(maybeOptions: unknown): maybeOptions is GameOptions {
    return typeof maybeOptions === "object"
        && maybeOptions !== null
        && isGameType((maybeOptions as GameOptions).gameType)
        && isUnitType((maybeOptions as GameOptions).unitType) 
        && isGuessable((maybeOptions as GameOptions).guessFrom) 
        && isGuessable((maybeOptions as GameOptions).guess) 
        && isUnitFilters((maybeOptions as GameOptions).filters);
}

