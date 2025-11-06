import { getUnambiguousName, type Unit } from "src/data/common";
import { units } from "src/data/units";
import {
    AnswerNotFoundError,
    createGameStore,
    createGameStoreActions,
    formatQuestion,
    formatTitle,
    QuestionNotFoundError,
} from "src/game/common";
import { type GameOptions, matchesFilters } from "src/gameOptions";
import { preloadImage } from "src/utils/preloadImage";
import { toShuffled } from "src/utils/random";
import { ulid } from "ulid";
import { createChoiceGameStoreActions } from "./actionFactory";
import { plausibleAnswerUnits } from "./plausibleAnswers";
import type { ChoiceAnswer, ChoiceGameStore, ChoiceGameStoreHook, ChoiceQuestion } from "./types";

export async function createChoiceGameStore(options: GameOptions): Promise<ChoiceGameStoreHook> {
    const unitsMatchingType = units.filter((unit) => unit.type === options.unitType);
    const questionUnits = getQuestionUnits(unitsMatchingType, options);
    const { questions, questionIds, answers, answerIds } = getQuestions(questionUnits, unitsMatchingType, options);

    if (options.guessFrom === "flag" || options.guessFrom === "coa") {
        const firstTwoQuestionIds = questionIds.slice(0, 2);

        // preload flags/COAs for the first two prompts
        await Promise.all(firstTwoQuestionIds.map((id) => {
            const question = questions[id];
            if (!question)
                throw new QuestionNotFoundError(id);

            return preloadImage(question.value)
        }));
    }
    if (options.guess === "flag" || options.guess === "coa") {
        const firstTwoQuestionIds = questionIds.slice(0, 2);

        // preload flags/COAs for answers of the first two prompts
        await Promise.all(firstTwoQuestionIds.map((id) => {
            const question = questions[id];
            if (!question)
                throw new QuestionNotFoundError(id);

            return Promise.all(question.answerIds.map((id) => {
                const answer = answers[id];
                if (!answer)
                    throw new AnswerNotFoundError(id);

                return preloadImage(answer.value);
            }));
        }));
    }

    return createGameStore<ChoiceGameStore>((set, get) => ({
        state: "unpaused",
        timestamps: [Date.now()],
        options,
        questions,
        questionIds,
        answers,
        answerIds,
        title: (options.guessFrom === "flag" || options.guessFrom === "coa")
            ? formatTitle(options)
            : undefined,
        current: questionIds[0],
        answered: 0,
        ...createGameStoreActions(set, get),
        ...createChoiceGameStoreActions(set, get),
    }));
}

function getQuestionUnits(unitsMatchingType: Unit[], options: GameOptions): Unit[] {
    const units = unitsMatchingType.filter((unit) => matchesFilters(unit, options.filters));
    if (options.maxQuestions) {
        return toShuffled(units).slice(0, options.maxQuestions);
    }
    return units;
}

/** Generates questions about the provided administrative units.
 *  Also generates all the answers to these questions. */
function getQuestions(units: Unit[], allUnits: Unit[], options: GameOptions): {
    questions: Record<string, ChoiceQuestion | undefined>;
    questionIds: string[];
    answers: Record<string, ChoiceAnswer | undefined>;
    answerIds: string[];
} {
    const questions: Record<string, ChoiceQuestion | undefined> = {};
    const questionIds: string[] = [];

    let allAnswers: Record<string, ChoiceAnswer | undefined> = {};
    const allAnswerIds: string[] = [];

    for (const unit of units) {
        const questionId = ulid();

        const { answers, answerIds } = getAnswers(unit, allUnits, questionId, options);
        allAnswers = { ...allAnswers, ...answers };
        allAnswerIds.push(...answerIds);

        const question: ChoiceQuestion = {
            id: questionId,
            about: unit.id,
            value: getQuestionValue(unit, options),
            tries: 0,
            answerIds,
        };
        questions[questionId] = question;
        questionIds.push(questionId);
    }
    
    return {
        questions,
        questionIds: toShuffled(questionIds),
        answers: allAnswers,
        answerIds: allAnswerIds,
    };
}

function getQuestionValue(unit: Unit, options: GameOptions) {
    if (options.guessFrom === "flag") {
        return "/images/flag/" + unit.id + ".svg";
    } else if (options.guessFrom === "coa") {
        return "/images/coa/" + unit.id + ".svg";
    }
    return formatQuestion(unit, options);
}

function getAnswers(unit: Unit, allUnits: Unit[], questionId: string, options: GameOptions): {
    answers: Record<string, ChoiceAnswer | undefined>;
    answerIds: string[];
} {
    const answers: Record<string, ChoiceAnswer | undefined> = {};
    const answerIds: string[] = [];

    // generate correct answer
    const correctAnswer = getAnswerFromUnit(unit, options, questionId, true);
    answers[correctAnswer.id] = correctAnswer;
    answerIds.push(correctAnswer.id);

    // add plausible answers to the list
    const plausibleUnits = plausibleAnswerUnits(unit, allUnits, options);
    for (const unit of plausibleUnits) {
        const answer = getAnswerFromUnit(unit, options, questionId);
        answers[answer.id] = answer;
        answerIds.push(answer.id);
    }

    // randomly choose remaining answers
    while (answerIds.length < 6) {
        const randomIndex = Math.floor(Math.random() * allUnits.length);
        const incorrectUnit = allUnits[randomIndex];
        const incorrectAnswer = getAnswerFromUnit(incorrectUnit, options, questionId);

        const isDuplicate = answerIds.some((id) => {
            const answer = answers[id];
            if (!answer)
                throw new AnswerNotFoundError(id);
            // don't use this answer if an answer about the same unit already exists
            // also don't use this answer if it has the same value as an existing answer
            return incorrectAnswer.about === answer.about || incorrectAnswer.value === answer.value;
        });
        if (!isDuplicate) {
            answers[incorrectAnswer.id] = incorrectAnswer;
            answerIds.push(incorrectAnswer.id);
        }
    }

    return {
        answers,
        answerIds: toShuffled(answerIds),
    };
}

function getAnswerFromUnit(unit: Unit, options: GameOptions, questionId: string, correct?: boolean): ChoiceAnswer {
    const answer: ChoiceAnswer = {
        id: ulid(),
        questionId,
        about: unit.id,
        value: getAnswerValue(unit, options),
        correct: !!correct,
    };
    return answer;
};

function getAnswerValue(unit: Unit, options: GameOptions): string {
    if (options.guess === "name") {
        const prefix = (unit.type === "voivodeship")
            ? "województwo "
            : (unit.countyType === "city") ? "miasto " : "powiat ";
        return prefix + getUnambiguousName(unit);
    } else if (options.guess === "capital") {
        return unit.capitals.join(", ");
    } else if (options.guess === "plate") {
        return unit.plates.join(", ");
    } else if (options.guess === "flag") {
        return "/images/flag/" + unit.id + ".svg";
    } else if (options.guess === "coa") {
        return "/images/coa/" + unit.id + ".svg";
    }
    throw Error("Text not defined for the provided game options.");
}
