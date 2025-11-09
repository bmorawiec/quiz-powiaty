import {
    isCountyType,
    isGuessable,
    isUnitType,
    isVoivodeshipId,
    type CountyType,
    type Guessable,
    type Unit,
    type UnitType,
    type VoivodeshipId,
} from "src/data/common";

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

export function matchesFilters(unit: Unit, filters: UnitFilters): boolean {
    return matchesVoivodeshipFilters(unit, filters) && matchesOtherFilters(unit, filters);
}

/** Checks whether the provided administrative unit matches filters other than the voivodeship filters. */
export function matchesOtherFilters(unit: Unit, filters: UnitFilters): boolean {
    if (unit.type === "county") {
        return filters.countyTypes.length === 0 || filters.countyTypes.includes(unit.countyType!);
    }
    return true;
}

/** Returns true if the provided administrative unit matches the voivodeships selected in the specified filters */
export function matchesVoivodeshipFilters(unit: Unit, filters: UnitFilters): boolean {
    if (unit.type === "county") {
        return filters.voivodeships.length === 0 || filters.voivodeships.includes(unit.parent!);
    }
    return true;
}
