import type { Unit } from "src/data/common";
import { units } from "src/data/units";
import { createGameStore, createGameStoreActions, formatTitle, getQuestionText } from "src/game/common";
import { type GameOptions, InvalidGameOptionsError, matchesFilters } from "src/gameOptions";
import { preloadImage } from "src/utils/preloadImage";
import { toShuffled } from "src/utils/shuffle";
import { createTypingGameStoreActions } from "./actionFactory";
import { type TypingAnswer, type TypingGameStore, type TypingGameStoreHook, type TypingQuestion } from "./types";

export async function createTypingGameStore(options: GameOptions): Promise<TypingGameStoreHook> {
    const filteredUnits = units
        .filter((unit) => unit.type === options.unitType && matchesFilters(unit, options.filters));
    const questions = getQuestions(filteredUnits, options);
    if (options.guessFrom === "flag" || options.guessFrom === "coa") {
        // preload all flags/COAs
        await Promise.all(questions.map((question) => preloadImage(question.imageURL!)));
    }

    return createGameStore<TypingGameStore>((set, get) => ({
        state: "unpaused",
        timestamps: [Date.now()],
        options,
        title: formatTitle(options),
        questions,
        answered: 0,
        ...createGameStoreActions(set, get),
        ...createTypingGameStoreActions(set, get),
    }));
}

/** Generates an array of questions about the provided administrative units. */
function getQuestions(units: Unit[], options: GameOptions): TypingQuestion[] {
    const questions = units.map((unit) => {
        const question: TypingQuestion = {
            id: unit.id,
            text: getQuestionText(unit, options),
            answers: getQuestionAnswers(unit, options),
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
    if (options.guessFrom === "flag" || options.guessFrom === "coa") {
        return toShuffled(questions);   // scramble questions so that you can't guess based on alphabetical order
    } else {
        // if guessing based on text, then the questions should be ordered alphabetically
        return questions.sort((a, b) => a.text!.localeCompare(b.text!));        // using sort with side effects
    }
}

function getQuestionAnswers(unit: Unit, options: GameOptions): TypingAnswer[] {
    return getQuestionAnswerStrings(unit, options).map((text) => ({
        id: unit.id,
        text,
        correct: true,
        guessed: false,
        slotIndex: -1,
    } satisfies TypingAnswer));
}

function getQuestionAnswerStrings(unit: Unit, options: GameOptions): string[] {
    if (options.guess === "name") {
        return [unit.name];
    } else if (options.guess === "capital") {
        return unit.capitals;
    } else if (options.guess === "plate") {
        return unit.plates;
    }
    throw new InvalidGameOptionsError();
}
