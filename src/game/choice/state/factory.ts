import type { Unit } from "src/data/common";
import { units } from "src/data/units";
import { createGameStore, createGameStoreActions, formatQuestion } from "src/game/common";
import { type GameOptions, matchesFilters } from "src/gameOptions";
import { preloadImage } from "src/utils/preloadImage";
import { toShuffled } from "src/utils/shuffle";
import { createChoiceGameStoreActions } from "./actionFactory";
import { plausibleAnswerUnits } from "./plausibleAnswers";
import type { ChoiceAnswer, ChoiceGameStore, ChoiceGameStoreHook, ChoiceQuestion } from "./types";

export async function createChoiceGameStore(options: GameOptions): Promise<ChoiceGameStoreHook> {
    const matchingUnits = units.filter((unit) => unit.type === options.unitType);
    const filteredUnits = matchingUnits.filter((unit) => matchesFilters(unit, options.filters));
    const questions = getQuestions(filteredUnits, matchingUnits, options);
    if (options.guessFrom === "flag" || options.guessFrom === "coa") {
        const firstTwoQuestions = questions.slice(0, 2);
        // preload flags/COAs for the first two prompts
        await Promise.all(firstTwoQuestions.map((prompt) => preloadImage(prompt.imageURL!)));
    } else if (options.guess === "flag" || options.guess === "coa") {
        const firstTwoQuestions = questions.slice(0, 2);
        // preload flags/COAs for answers of the first two prompts
        await Promise.all(firstTwoQuestions.map((prompt) =>
            Promise.all(prompt.answers.map((answer) => answer.imageURL))));
    }

    return createGameStore<ChoiceGameStore>((set, get) => ({
        state: "unpaused",
        timestamps: [Date.now()],
        options,
        questions,
        current: 0,
        answered: 0,
        ...createGameStoreActions(set, get),
        ...createChoiceGameStoreActions(set, get),
    }));
}

/** Generates an array of questions about the provided administrative units. */
function getQuestions(units: Unit[], allUnits: Unit[], options: GameOptions): ChoiceQuestion[] {
    const shuffledUnits = toShuffled(units);
    return shuffledUnits.map((unit) => {
        const question: ChoiceQuestion = {
            id: unit.id,
            text: formatQuestion(unit, options),
            answers: getAnswers(unit, allUnits, options),
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

function getAnswers(unit: Unit, allUnits: Unit[], options: GameOptions): ChoiceAnswer[] {
    const answers: ChoiceAnswer[] = plausibleAnswerUnits(unit, allUnits, options)
        .map((unit) => getAnswerFromUnit(unit, options));

    // randomly choose five incorrect answers
    while (answers.length < 5) {
        const randomIndex = Math.floor(Math.random() * allUnits.length);
        const incorrectUnit = allUnits[randomIndex];
        if (incorrectUnit !== unit && !answers.some((option) => option.id === incorrectUnit.id)) {
            answers.push(getAnswerFromUnit(incorrectUnit, options));
        }
    }

    // add correct answer to array of answers
    answers.push(getAnswerFromUnit(unit, options, true));

    return toShuffled(answers);
}

function getAnswerFromUnit(unit: Unit, options: GameOptions, correct?: boolean): ChoiceAnswer {
    const answer: ChoiceAnswer = {
        id: unit.id,
        correct: !!correct,
    };
    if (options.guess === "flag") {
        answer.imageURL = "/images/flag/" + unit.id + ".svg";
    } else if (options.guess === "coa") {
        answer.imageURL = "/images/coa/" + unit.id + ".svg";
    } else {
        answer.text = getAnswerText(unit, options);
    }
    return answer;
};

function getAnswerText(unit: Unit, options: GameOptions): string {
    if (options.guess === "name") {
        const prefix = (unit.type === "voivodeship")
            ? "województwo "
            : (unit.countyType === "city") ? "miasto " : "powiat ";
        return prefix + unit.name;
    } else if (options.guess === "capital") {
        return unit.capitals.join(", ");
    } else if (options.guess === "plate") {
        return unit.plates.join(", ");
    }
    throw Error("Text not defined for the provided game options.");
}
