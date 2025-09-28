import type { Unit } from "src/data/common";
import { units } from "src/data/units";
import {
    createGameStore,
    createGameStoreActions,
    formatQuestion,
    formatTitle,
    QuestionNotFoundError,
} from "src/game/common";
import { type GameOptions, InvalidGameOptionsError, matchesFilters } from "src/gameOptions";
import { preloadImage } from "src/utils/preloadImage";
import { toShuffled } from "src/utils/shuffle";
import { ulid } from "ulid";
import { createPromptGameStoreActions } from "./actionFactory";
import { type PromptAnswer, type PromptGameStore, type PromptGameStoreHook, type PromptQuestion } from "./types";

export async function createPromptGameStore(options: GameOptions): Promise<PromptGameStoreHook> {
    const questionUnits = getQuestionUnits(options);
    const { questions, questionIds, answers, answerIds } = getQuestions(questionUnits, options);

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

    return createGameStore<PromptGameStore>((set, get) => ({
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
        ...createPromptGameStoreActions(set, get),
    }));
}

function getQuestionUnits(options: GameOptions) {
    const questionUnits = units
        .filter((unit) => unit.type === options.unitType && matchesFilters(unit, options.filters));

    if (options.maxQuestions) {
        return toShuffled(questionUnits).slice(0, options.maxQuestions);
    }
    return questionUnits;
}

/** Generates questions about the provided administrative units. */
function getQuestions(units: Unit[], options: GameOptions): {
    questions: Record<string, PromptQuestion | undefined>;
    questionIds: string[];
    answers: Record<string, PromptAnswer | undefined>;
    answerIds: string[];
} {
    const questions: Record<string, PromptQuestion | undefined> = {};
    const questionIds: string[] = [];

    let allAnswers: Record<string, PromptAnswer | undefined> = {};
    const allAnswerIds: string[] = [];

    for (const unit of units) {
        const questionId = ulid();

        const { answers, answerIds } = getAnswers(unit, questionId, options);
        allAnswers = { ...allAnswers, ...answers };
        allAnswerIds.push(...answerIds);

        const question: PromptQuestion = {
            id: questionId,
            about: unit.id,
            value: getPromptValue(unit, options),
            tries: 0,
            answerIds,
            provided: 0,
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

function getPromptValue(unit: Unit, options: GameOptions): string {
    if (options.guessFrom === "flag") {
        return "/images/flag/" + unit.id + ".svg";
    } else if (options.guessFrom === "coa") {
        return "/images/coa/" + unit.id + ".svg";
    }
    return formatQuestion(unit, options);
}

function getAnswers(unit: Unit, questionId: string, options: GameOptions): {
    answers: Record<string, PromptAnswer | undefined>;
    answerIds: string[];
} {
    const answers: Record<string, PromptAnswer | undefined> = {};
    const answerIds: string[] = [];

    const answerValues = getAnswerValues(unit, options);

    for (const value of answerValues) {
        const answer: PromptAnswer = {
            id: ulid(),
            questionId,
            about: unit.id,
            value,
            correct: true,
            guessed: false,
        };
        answers[answer.id] = answer;
        answerIds.push(answer.id);
    }

    return {
        answers,
        answerIds,
    };
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
