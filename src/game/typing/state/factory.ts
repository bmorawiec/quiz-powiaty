import { getUnambiguousName, type Unit } from "src/data/common";
import { units } from "src/data/units";
import {
    createGameStore,
    createGameStoreActions,
    formatTitle,
    getQuestionText,
    QuestionNotFoundError,
} from "src/game/common";
import { type GameOptions, InvalidGameOptionsError, matchesFilters } from "src/gameOptions";
import { preloadImage } from "src/utils/preloadImage";
import { toShuffled } from "src/utils/random";
import { ulid } from "ulid";
import { createTypingGameStoreActions } from "./actionFactory";
import { type TypingAnswer, type TypingGameStore, type TypingGameStoreHook, type TypingQuestion } from "./types";

export async function createTypingGameStore(options: GameOptions): Promise<TypingGameStoreHook> {
    const questionUnits = getQuestionUnits(options);
    const { questions, questionIds, answers, answerIds } = getQuestions(questionUnits, options);

    if (options.guessFrom === "flag" || options.guessFrom === "coa") {
        // preload flags/COAs for the all the prompts
        await Promise.all(questionIds.map((id) => {
            const question = questions[id];
            if (!question)
                throw new QuestionNotFoundError(id);

            return preloadImage(question.value);
        }));
    }

    return createGameStore<TypingGameStore>((set, get) => ({
        state: "unpaused",
        timestamps: [Date.now()],
        options,
        questions,
        questionIds,
        answers,
        answerIds,
        title: formatTitle(options, true),
        answered: 0,
        ...createGameStoreActions(set, get),
        ...createTypingGameStoreActions(set, get),
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
    questions: Record<string, TypingQuestion | undefined>;
    questionIds: string[];
    answers: Record<string, TypingAnswer | undefined>;
    answerIds: string[];
} {
    const questions: Record<string, TypingQuestion | undefined> = {};
    let questionIds: string[] = [];

    let allAnswers: Record<string, TypingAnswer | undefined> = {};
    const allAnswerIds: string[] = [];

    for (const unit of units) {
        const questionId = ulid();

        const { answers, answerIds } = getAnswers(unit, questionId, options);
        allAnswers = { ...allAnswers, ...answers };
        allAnswerIds.push(...answerIds);

        const question: TypingQuestion = {
            id: questionId,
            about: unit.id,
            value: getQuestionValue(unit, options),
            tries: 0,
            answerIds,
            provided: 0,
        };
        questions[questionId] = question;
        questionIds.push(questionId);
    }

    if (options.guessFrom === "flag" || options.guessFrom === "coa") {
        // scramble questions so that you can't guess based on alphabetical order
        questionIds = toShuffled(questionIds);
    } else {
        // if guessing based on text, then the questions should be ordered alphabetically
        questionIds.sort((a, b) => {            // using sort with side effects
            const questionA = questions[a];
            const questionB = questions[b];
            if (!questionA || !questionB)
                throw new QuestionNotFoundError(a, b);
            return questionA.value.localeCompare(questionB.value);
        });
    }

    return {
        questions,
        questionIds,
        answers: allAnswers,
        answerIds: allAnswerIds,
    };
}

function getQuestionValue(unit: Unit, options: GameOptions): string {
    if (options.guessFrom === "flag") {
        return "/images/flag/" + unit.id + ".svg";
    } else if (options.guessFrom === "coa") {
        return "/images/coa/" + unit.id + ".svg";
    }
    return getQuestionText(unit, options);
}

function getAnswers(unit: Unit, questionId: string, options: GameOptions): {
    answers: Record<string, TypingAnswer | undefined>;
    answerIds: string[];
} {
    const answers: Record<string, TypingAnswer | undefined> = {};
    const answerIds: string[] = [];

    const answerValues = getAnswerValues(unit, options);

    for (const value of answerValues) {
        const answer: TypingAnswer = {
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
        return [getUnambiguousName(unit)];
    } else if (options.guess === "capital") {
        return unit.capitals;
    } else if (options.guess === "plate") {
        return unit.plates;
    }
    throw new InvalidGameOptionsError();
}
