import { getUnambiguousName, type Unit } from "src/data/common";
import { units } from "src/data/units";
import {
    AnswerNotFoundError,
    QuestionNotFoundError,
    createGameStore,
    createGameStoreActions,
    formatTitle,
    getQuestionText,
} from "src/game/common";
import { InvalidGameOptionsError, matchesFilters, type GameOptions } from "src/gameOptions";
import { preloadImage } from "src/utils/preloadImage";
import { toShuffled } from "src/utils/random";
import { ulid } from "ulid";
import { createDnDGameStoreActions } from "./actionFactory";
import {
    CardNotFoundError,
    type DnDAnswer,
    type DnDCard,
    type DnDGameStore,
    type DnDGameStoreHook,
    type DnDQuestion,
} from "./types";

export async function createDnDGameStore(options: GameOptions): Promise<DnDGameStoreHook> {
    const questionUnits = getQuestionUnits(options);
    const { questions, questionIds, answers, answerIds } = getQuestions(questionUnits, options);
    const { cards, unusedCardIds } = getCards(answers, answerIds, options);

    if (options.guessFrom === "flag" || options.guessFrom === "coa") {
        // preload flags/COAs for the all the prompts
        await Promise.all(questionIds.map((id) => {
            const question = questions[id];
            if (!question)
                throw new QuestionNotFoundError(id);

            return preloadImage(question.value);
        }));
    }
    if (options.guess === "flag" || options.guess === "coa") {
        // preload flags/COAs for the all the answers/cards
        await Promise.all(answerIds.map((id) => {
            const answer = answers[id];
            if (!answer)
                throw new AnswerNotFoundError(id);

            return preloadImage(answer.value);
        }));
    }

    return createGameStore<DnDGameStore>((set, get) => ({
        state: "unpaused",
        timestamps: [Date.now()],
        options,
        questions,
        questionIds,
        answers,
        answerIds,
        answered: 0,
        title: formatTitle(options, true),
        correct: 0,
        cards,
        unusedCardIds,
        ...createGameStoreActions(set, get),
        ...createDnDGameStoreActions(set, get),
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
    questions: Record<string, DnDQuestion | undefined>;
    questionIds: string[];
    answers: Record<string, DnDAnswer | undefined>;
    answerIds: string[];
} {
    const questions: Record<string, DnDQuestion | undefined> = {};
    let questionIds: string[] = [];

    let allAnswers: Record<string, DnDAnswer | undefined> = {};
    const allAnswerIds: string[] = [];

    for (const unit of units) {
        const questionId = ulid();

        const { answers, answerIds } = getAnswers(unit, questionId, options);
        allAnswers = { ...allAnswers, ...answers };
        allAnswerIds.push(...answerIds);

        const question: DnDQuestion = {
            id: questionId,
            about: unit.id,
            value: getQuestionValue(unit, options),
            tries: 0,
            answerIds,
            cardIds: answerIds.map(() => null),
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
    answers: Record<string, DnDAnswer | undefined>;
    answerIds: string[];
} {
    const answers: Record<string, DnDAnswer | undefined> = {};
    const answerIds: string[] = [];

    const answerValues = getAnswerValues(unit, options);

    for (const value of answerValues) {
        const answer: DnDAnswer = {
            id: ulid(),
            questionId,
            about: unit.id,
            value,
            correct: true,
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
    } else if (options.guess === "flag") {
        return ["/images/flag/" + unit.id + ".svg"];
    } else if (options.guess === "coa") {
        return ["/images/coa/" + unit.id + ".svg"];
    }
    throw new InvalidGameOptionsError();
}

function getCards(answers: Record<string, DnDAnswer | undefined>, answerIds: string[], options: GameOptions): {
    cards: Record<string, DnDCard | undefined>;
    unusedCardIds: string[];
} {
    const cards: Record<string, DnDCard | undefined> = {};

    for (const answerId of answerIds) {
        const answer = answers[answerId];
        if (!answer)
            throw new AnswerNotFoundError();

        const card: DnDCard = {
            id: answer.id,
            questionId: null,
            slotIndex: -1,
            value: answer.value,
            verificationResult: null,
        };
        cards[card.id] = card;
    }

    return {
        cards,
        unusedCardIds: getCardIds(answerIds, cards, options),
    };
}

function getCardIds(answerIds: string[], cards: Record<string, DnDCard | undefined>, options: GameOptions): string[] {
    if (options.guess === "flag" || options.guess === "coa") {
        // scramble cards so that you can't guess based on alphabetical order
        return toShuffled(answerIds);
    } else {
        // if guessing based on text, then the cards should be ordered alphabetically
        const cardIds = [...answerIds];
        cardIds.sort((a, b) => {            // using sort with side effects
            const cardA = cards[a];
            const cardB = cards[b];
            if (!cardA || !cardB)
                throw new CardNotFoundError(a, b);
            return cardA.value.localeCompare(cardB.value);
        });
        return cardIds;
    }
}
