import type { Unit } from "src/data/common";
import { units } from "src/data/units";
import { matchesVoivodeshipFilters, matchesOtherFilters, type GameOptions } from "src/gameOptions";
import { preloadImage } from "src/utils/preloadImage";
import { toShuffled } from "src/utils/random";
import { ulid } from "ulid";
import {
    QuestionNotFoundError,
    createGameStore,
    createGameStoreActions,
    formatQuestion,
    formatTitle,
    getInitialGameStoreState,
} from "../../common";
import { createMapGameStoreActions } from "./actionFactory";
import type { MapAnswer, MapFeature, MapGameStore, MapGameStoreHook, MapQuestion } from "./types";

export async function createMapGameStore(options: GameOptions): Promise<MapGameStoreHook> {
    const unitsMatchingVoivodeshipFilters = units
        .filter((unit) => unit.type === options.unitType && matchesVoivodeshipFilters(unit, options.filters));
    const questionUnits = toShuffled(unitsMatchingVoivodeshipFilters
            .filter((unit) => matchesOtherFilters(unit, options.filters)))
        .slice(0, options.maxQuestions ?? undefined);

    const { questions, questionIds, answers, answerIds } = getQuestions(questionUnits, options);
    const { features, featureIds } = getFeatures(unitsMatchingVoivodeshipFilters, questions, questionIds);

    if (options.guessFrom === "flag" || options.guessFrom === "coa") {
        const firstTwoQuestionIds = questionIds.slice(0, 2);

        // preload flags/COAs for the first two questions
        await Promise.all(firstTwoQuestionIds.map((id) => {
            const question = questions[id];
            if (!question)
                throw new QuestionNotFoundError(id);

            return preloadImage(question.value)
        }));
    }

    return createGameStore<MapGameStore>((set, get) => ({
        ...getInitialGameStoreState(),
        options,
        questions,
        questionIds,
        answers,
        answerIds,
        features,
        featureIds,
        title: (options.guessFrom === "flag" || options.guessFrom === "coa")
            ? formatTitle(options)
            : undefined,
        current: questionIds[0],
        ...createGameStoreActions(set, get),
        ...createMapGameStoreActions(set, get),
    }));
}

/** Generates questions about the provided administrative units. */
function getQuestions(units: Unit[], options: GameOptions): {
    questions: Record<string, MapQuestion | undefined>;
    questionIds: string[];
    answers: Record<string, MapAnswer | undefined>;
    answerIds: string[];
} {
    const questions: Record<string, MapQuestion | undefined> = {};
    const questionIds: string[] = [];

    let allAnswers: Record<string, MapAnswer | undefined> = {};
    const allAnswerIds: string[] = [];

    for (const unit of units) {
        const questionId = ulid();

        const { answers, answerIds } = getAnswers(unit, questionId);
        allAnswers = { ...allAnswers, ...answers };
        allAnswerIds.push(...answerIds);

        const question: MapQuestion = {
            id: questionId,
            about: unit.id,
            value: getQuestionValue(unit, options),
            tries: 0,
            answerIds,
            guessed: false,
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

function getQuestionValue(unit: Unit, options: GameOptions): string {
    if (options.guessFrom === "flag") {
        return "/images/flag/" + unit.id + ".svg";
    } else if (options.guessFrom === "coa") {
        return "/images/coa/" + unit.id + ".svg";
    }
    return formatQuestion(unit, options);
}

function getAnswers(unit: Unit, questionId: string): {
    answers: Record<string, MapAnswer | undefined>;
    answerIds: string[];
} {
    const answer: MapAnswer = {
        id: ulid(),
        questionId,
        about: unit.id,
        value: unit.id,
        correct: true,
    };

    return {
        answers: {
            [answer.id]: answer,
        },
        answerIds: [answer.id],
    };
}

function getFeatures(units: Unit[], questions: Record<string, MapQuestion | undefined>, questionIds: string[]): {
    features: Record<string, MapFeature | undefined>;
    featureIds: string[];
} {
    const features: Record<string, MapFeature | undefined> = {};
    const featureIds: string[] = [];

    for (const unit of units) {
        const questionId = questionIds.find((questionId) => {
            const question = questions[questionId];
            if (!question)
                throw new QuestionNotFoundError(questionId);
            return question.about === unit.id;
        });

        const feature: MapFeature = {
            id: ulid(),
            unitId: unit.id,
            questionId,
        };
        features[feature.id] = feature;
        featureIds.push(feature.id);
    }

    return { features, featureIds };
}
