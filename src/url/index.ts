import type { Guessable, UnitType } from "src/data";
import type { GameOptions, GameType } from "src/game/common";

const gameTypeToPolish: Record<GameType, string> = {
    choiceGame: "wybierz",
    dndGame: "przyporzadkuj",
    mapGame: "mapa",
    promptGame: "zgadnij",
    typingGame: "podpisz",
};

const unitTypeToPolish: Record<UnitType, string> = {
    county: "powiat",
    voivodeship: "wojewodztwo",
};

const guessableToPolish: Record<Guessable, string> = {
    name: "nazwa",
    capital: "stolica",
    allCapitals: "stolice",
    plate: "rejestracja",
    allPlates: "rejestracje",
    flag: "flaga",
    coa: "herb",
    map: "mapa",
};

const gameTypeFromPolish = flipObject(gameTypeToPolish);
const unitTypeFromPolish = flipObject(unitTypeToPolish);
const guessableFromPolish = flipObject(guessableToPolish);

/** Encodes game options into an URL. */
export function encodeGameURL(options: GameOptions): string {
    return "/graj"
        + "?tryb=" + gameTypeToPolish[options.gameType]
        + "&typ=" + unitTypeToPolish[options.unitType]
        + "&dane=" + guessableToPolish[options.guessFrom]
        + "&zgadnij=" + guessableToPolish[options.guess];
}

/** Reads game options from URL search params (the part of the URL after the '?').
 *  @returns null if the URL is invalid. Otherwise returns a GameOptions object. */
export function decodeGameURL(params: URLSearchParams): GameOptions | null {
    const gameTypePl = params.get("tryb");
    const unitTypePl = params.get("typ");
    const guessFromPl = params.get("dane");
    const guessPl = params.get("zgadnij");
    if (!gameTypePl || !unitTypePl || !guessFromPl || !guessPl) {
        return null;
    }
    const gameType = gameTypeFromPolish[gameTypePl];
    const unitType = unitTypeFromPolish[unitTypePl];
    const guessFrom = guessableFromPolish[guessFromPl];
    const guess = guessableFromPolish[guessPl];
    if (!gameType || !unitType || !guessFrom || !guess) {
        return null;
    }
    return {
        gameType,
        unitType,
        guessFrom,
        guess,
        filters: [],
    };
}

function flipObject<TKey extends string>(map: Record<TKey, string>): Record<string, TKey | undefined> {
    return Object.fromEntries(Object.entries<string>(map).map(([key, value]) => [value, key as TKey]));
}
