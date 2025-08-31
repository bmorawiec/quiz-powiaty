import type { Guessable, UnitType } from "src/data/common";
import type { GameOptions, GameType } from "./types";

const guessPl: Record<Guessable, string> = {
    name: "nazwę",
    capital: "stolicę",
    plate: "rejestracje",
    flag: "flagę",
    coa: "herb",
    map: "lokalizację na mapie",
};

const guessFromPl: Record<Guessable, string> = {
    name: "nazwy",
    capital: "stolicy",
    plate: "rejestracji",
    flag: "flagi",
    coa: "herbu",
    map: "lokalizacji na mapie",
};

const unitTypePl: Record<UnitType, string> = {
    voivodeship: "województwa",
    county: "powiatu",
};

const gameTypePl: Record<GameType, string> = {
    choiceGame: "wybierz",
    dndGame: "przyporządkuj",
    mapGame: "mapa",
    promptGame: "zgadnij",
    typingGame: "podpisz",
};

export function getGameModeName(options: GameOptions): string {
    return "Zgadnij " + guessPl[options.guess] + " " + unitTypePl[options.unitType]
        + " na podstawie jego " + guessFromPl[options.guessFrom] + " (" + gameTypePl[options.gameType] + ")";
}
