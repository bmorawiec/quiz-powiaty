import type { Unit } from "src/data/common";
import { units } from "src/data/units";
import { createGameStore, createGameStoreActions, formatQuestion, formatTitle } from "src/game/common";
import { type GameOptions, InvalidGameOptionsError, matchesFilters } from "src/gameOptions";
import { preloadImage } from "src/utils/preloadImage";
import { toShuffled } from "src/utils/shuffle";
import { ulid } from "ulid";
import { createPromptGameStoreActions } from "./actionFactory";
import { type PromptAnswer, type PromptGameStore, type PromptGameStoreHook, type PromptQuestion } from "./types";

export async function createPromptGameStore(options: GameOptions): Promise<PromptGameStoreHook> {
    const filteredUnits = units
        .filter((unit) => unit.type === options.unitType && matchesFilters(unit, options.filters));
    const prompts = getPrompts(filteredUnits, options);
    if (options.guessFrom === "flag" || options.guessFrom === "coa") {
        const firstTwoPrompts = prompts.slice(0, 2);
        // preload flags/COAs for the first two prompts
        await Promise.all(firstTwoPrompts.map((prompt) => preloadImage(prompt.value)));
    }

    return createGameStore<PromptGameStore>((set, get) => ({
        state: "unpaused",
        timestamps: [Date.now()],
        options,
        title: (options.guessFrom === "flag" || options.guessFrom === "coa")
            ? formatTitle(options)
            : undefined,
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
            id: ulid(),
            about: unit.id,
            value: getPromptValue(unit, options),
            answers: getAnswers(unit, options),
            provided: 0,
            tries: 0,
        };
        return question;
    });
}

function getPromptValue(unit: Unit, options: GameOptions): string {
    if (options.guessFrom === "flag") {
        return "/images/flag/" + unit.id + ".svg";
    } else if (options.guessFrom === "coa") {
        return "/images/coa/" + unit.id + ".svg";
    }
    return formatQuestion(unit, options);
}

function getAnswers(unit: Unit, options: GameOptions): PromptAnswer[] {
    return getAnswerValues(unit, options).map((value) => ({
        id: ulid(),
        about: unit.id,
        value,
        correct: true,
        guessed: false,
    } satisfies PromptAnswer));
}

function getAnswerValues(unit: Unit, options: GameOptions): string[] {
    if (options.guess === "name") {
        return [unit.name];
    } else if (options.guess === "capital") {
        return unit.capitals;
    } else if (options.guess === "plate") {
        return unit.plates;
    }
    throw new InvalidGameOptionsError();
}
