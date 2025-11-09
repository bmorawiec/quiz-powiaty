import { isGuessable, isUnitType, type Guessable, type UnitType } from "src/data/common";
import { type UnitFilters, isUnitFilters } from "./filters";

export class InvalidGameOptionsError extends Error {
    name = "InvalidGameOptionsError";

    constructor() {
        super("Invalid game options.");
    }
}

export const gameTypes = ["choiceGame", "dndGame", "mapGame", "promptGame", "typingGame"] as const;
export type GameType = (typeof gameTypes)[number];

export function isGameType(maybeGameType: unknown): maybeGameType is GameType {
    return gameTypes.includes(maybeGameType as GameType);
}

export interface GameOptions {
    gameType: GameType;
    unitType: UnitType;
    guessFrom: Guessable;
    guess: Guessable;
    maxQuestions: number | null;
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

