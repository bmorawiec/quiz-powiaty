import { guessables, unitTypes, type GameOptions, type UnitType } from "../types";

export function validateGameOptions(options: GameOptions): boolean {
    if (options.guessFrom === options.guess) {
        return false;
    }
    if (options.unitType === "county") {
        // These games would be too easy (most counties are named after their capital), so they're not allowed.
        if (options.guessFrom === "name" && options.guess === "capital") return false;
        if (options.guessFrom === "capital" && options.guess === "name") return false;
    }
    if (options.mode === "promptGame" || options.mode === "typingGame") {
        // Flags, coats of arms and shapes are not text, so they can't be guessed in promptGame/typingGame.
        if (options.guess === "flag" || options.guess === "coa" || options.guess === "shape") return false;
    }
    return true;
}

export function getRandomOptions(): GameOptions {
    const guessFromIndex = Math.floor(Math.random() * guessables.length);
    const guessFrom = guessables[guessFromIndex];

    const guessOptions = guessables.filter((guessable) => guessable !== guessFrom);
    const guessIndex = Math.floor(Math.random() * guessOptions.length);
    const guess = guessOptions[guessIndex];

    let unitType: UnitType;
    // detect voivodeship-only combos
    if (guessFrom === "name" && guess === "capital" || guessFrom === "capital" && guess === "name") {
        unitType = "voivodeship";
    } else {
        const unitTypeIndex = Math.floor(Math.random() * unitTypes.length);
        unitType = unitTypes[unitTypeIndex];
    }

    return {
        mode: "choiceGame",
        unitType,
        guessFrom,
        guess,
        maxQuestions: 20,
        filters: {
            countyTypes: [],
            voivodeships: [],
        },
    };
}
