import {
    AnswerNotFoundError,
    QuestionNotFoundError,
    type Answers,
    type Question,
    type Questions,
} from "src/game2/questions";
import { createGameStore, type GameAPICallbacks, type GameAPIOptions } from "src/game2/api";
import { type GameOptions } from "src/game2/options";
import type { ZustandHook } from "src/utils/zustand";
import { ulid } from "ulid";
import { getPublicActions } from "./actions";
import {
    type Card,
    type Cards,
    type Cell,
    type Cells,
    type DnDGameStore,
} from "./types";
import { toShuffled } from "src/utils/random";

export async function createDnDGameStore(
    questionsAndAnswers: Questions & Answers,
    options: GameOptions,
    callbacks: GameAPICallbacks,
): Promise<ZustandHook<DnDGameStore>> {
    const apiOptions: GameAPIOptions = {
        questionsAndAnswers,
        preloadAllImages: true,
        ...callbacks,
    };
    return createGameStore(apiOptions, (set, get) => ({
        type: "dnd",
        options,
        ...createCellsAndCards(questionsAndAnswers),
        ...getPublicActions(set, get),
    }));
}

function createCellsAndCards(qsAndAs: Questions & Answers): Cells & Cards & { unusedCardIds: string[] } {
    const result: Cells & Cards & { unusedCardIds: string[] } = {
        cells: {},
        cellIds: [],

        cards: {},
        cardIds: [],

        unusedCardIds: [],
    };

    for (const questionId of qsAndAs.questionIds) {
        const question = qsAndAs.questions[questionId];
        if (!question)
            throw new QuestionNotFoundError(questionId);

        const cellId = ulid();

        const { cards, cardIds } = createCards(qsAndAs, question);
        result.cards = { ...result.cards, ...cards };
        result.cardIds.push(...cardIds);
        result.unusedCardIds.push(...cardIds);

        const cell: Cell = {
            id: cellId,
            questionId,
            cardSlots: question.answerIds.map(() => null),
        };
        result.cells[cellId] = cell;
        result.cellIds.push(cellId);
    }

    result.unusedCardIds = toShuffled(result.unusedCardIds);    // randomize order in which cards appear on the sidebar

    return result;
}

function createCards(qsAndAs: Questions & Answers, question: Question): Cards {
    const result: Cards = {
        cards: {},
        cardIds: [],
    };

    for (const answerId of question.answerIds) {
        const answer = qsAndAs.answers[answerId];
        if (!answer)
            throw new AnswerNotFoundError(answerId);

        const card: Card = {
            id: ulid(),
            answerId,
            cellId: null,
            slotIndex: -1,
            status: null,
        };
        result.cards[card.id] = card;
        result.cardIds.push(card.id);
    }

    return result;
}
