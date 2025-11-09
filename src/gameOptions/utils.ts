import { InvalidGameOptionsError, type GameOptions, type GameType } from "./types";

/** Checks if the provided game options are valid. */
export function validateGameOptions(options: GameOptions): boolean {
    if (options.guessFrom === options.guess) {
        return false;
    }
    if (options.guess === "map") {
        return options.gameType === "mapGame";
    }
    if (options.guess === "flag" || options.guess === "coa") {
        return options.gameType === "choiceGame" || options.gameType === "dndGame";
    }
    if (options.guessFrom === "name" && options.guess === "capital"
        || options.guessFrom === "capital" && options.guess === "name") {
        return options.unitType === "voivodeship";
    }
    return options.gameType !== "mapGame";
}

/** Returns all valid game types based on the providided guess-guessFrom combo.
 *  @throws if guessFrom is set to guess. */
export function gameTypesFromCombo(options: GameOptions): GameType[] {
    if (options.guessFrom === options.guess) {
        throw new InvalidGameOptionsError();
    }
    if (options.guess === "map") {
        return ["mapGame"];
    }
    if (options.guess === "flag" || options.guess === "coa") {
        return ["choiceGame", "dndGame"];
    }
    return ["choiceGame", "dndGame", "promptGame", "typingGame"];
}
