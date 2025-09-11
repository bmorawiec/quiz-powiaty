import type { Unit } from "src/data/common";
import { units } from "src/data/units";
import { createGameStore, createGameStoreActions, formatQuestion } from "src/game/common";
import { type GameOptions, InvalidGameOptionsError, matchesFilters } from "src/gameOptions";
import { preloadImage } from "src/utils/preloadImage";
import { toShuffled } from "src/utils/shuffle";
import { createPromptGameStoreActions } from "./actionFactory";
import { type PromptAnswer, type PromptGameStore, type PromptGameStoreHook, type PromptQuestion } from "./types";

export async function createPromptGameStore(options: GameOptions): Promise<PromptGameStoreHook> {
    const filteredUnits = units
        .filter((unit) => unit.type === options.unitType && matchesFilters(unit, options.filters));
    const prompts = getPrompts(filteredUnits, options);
    if (options.guessFrom === "flag" || options.guessFrom === "coa") {
        const firstTwoPrompts = prompts.slice(0, 2);
        // preload flags/COAs for the first two prompts
        await Promise.all(firstTwoPrompts.map((prompt) => preloadImage(prompt.imageURL!)));
    }

    return createGameStore<PromptGameStore>((set, get) => ({
        state: "unpaused",
        timestamps: [Date.now()],
        options,
        prompts,
        current: 0,
        answered: 0,
        ...createGameStoreActions(set, get),
        ...createPromptGameStoreActions(set, get),
    }));
}

/** Generates an array of prompts about the provided administrative units. */
function getPrompts(units: Unit[], options: GameOptions): PromptQuestion[] {
    const shuffledUnits = toShuffled(units);
    return shuffledUnits.map((unit) => {
        const question: PromptQuestion = {
            id: unit.id,
            text: formatQuestion(unit, options),
            answers: getPromptAnswers(unit, options),
            provided: 0,
            tries: 0,
        };
        if (options.guessFrom === "flag") {
            question.imageURL = "/images/flag/" + unit.id + ".svg";
        } else if (options.guessFrom === "coa") {
            question.imageURL = "/images/coa/" + unit.id + ".svg";
        }
        return question;
    });
}

function getPromptAnswers(unit: Unit, options: GameOptions): PromptAnswer[] {
    return getPromptAnswerStrings(unit, options).map((text) => ({
        id: unit.id,
        text,
        correct: true,
        guessed: false,
    } satisfies PromptAnswer));
}

function getPromptAnswerStrings(unit: Unit, options: GameOptions): string[] {
    if (options.guess === "name") {
        return [unit.name];
    } else if (options.guess === "capital") {
        return unit.capitals;
    } else if (options.guess === "plate") {
        return unit.plates;
    }
    throw new InvalidGameOptionsError();
}
