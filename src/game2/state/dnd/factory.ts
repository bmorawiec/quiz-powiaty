import {
    AnswerNotFoundError,
    createGameStore,
    QuestionNotFoundError,
    type Answers,
    type GameAPIOptions,
    type Question,
    type Questions,
} from "src/game2/api";
import { unitsFromOptions, type GameOptions } from "src/gameOptions";
import type { ZustandGetter, ZustandHook, ZustandSetter } from "src/utils/zustand";
import { ulid } from "ulid";
import {
    CardNotFoundError,
    CellNotFoundError,
    type Card,
    type Cards,
    type Cell,
    type Cells,
    type DnDGameActions,
    type DnDGameStore,
} from "./types";

export async function createDnDGameStore(
    options: GameOptions,
    onRestart: () => void,
): Promise<ZustandHook<DnDGameStore>> {
    const [units, allUnits] = await unitsFromOptions(options);
    const apiOptions: GameAPIOptions = {
        units,
        allUnits,
        guessFrom: options.guessFrom,
        guess: options.guess,
        sortQuestions: true,
        preloadAllImages: true,
        onRestart,
    };
    return createGameStore(apiOptions, (set, get, qsAndAs) => ({
        type: "dnd",
        ...createCellsAndCards(qsAndAs),
        ...createDnDGameActions(set, get),
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

        const { cards, cardIds } = createCards(qsAndAs, question, cellId);
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

    return result;
}

function createCards(qsAndAs: Questions & Answers, question: Question, cellId: string): Cards {
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
            cellId,
            slotIndex: -1,
            status: null,
        };
        result.cards[card.id] = card;
        result.cardIds.push(card.id);
    }

    return result;
}

function createDnDGameActions(
    set: ZustandSetter<DnDGameStore>,
    get: ZustandGetter<DnDGameStore>,
): DnDGameActions {
    function verify() {
        for (const cellId of get().cellIds) {
            verifyCell(cellId);
        }
    }

    function verifyCell(cellId: string) {
        const cell = get().cells[cellId];
        if (!cell) throw new CellNotFoundError(cellId);

        let anyWrongCards = false;
        for (const cardId of cell.cardSlots) {
            if (cardId) {
                const status = verifyCard(cell, cardId);
                if (status === "wrong") {
                    anyWrongCards = true;
                }
            }
        }

        if (anyWrongCards) {
            get().api.incorrectGuess(cell.questionId);
        }
    }

    function verifyCard(cell: Cell, cardId: string): "correct" | "wrong" {
        const card = get().cards[cardId];
        if (!card) throw new CardNotFoundError(cardId);

        const answer = get().api.answers[card.answerId];
        if (!answer) throw new AnswerNotFoundError(card.answerId);

        const newStatus = (cell.questionId === answer.questionId) ? "correct" : "wrong";
        const newCard: Card = {
            ...card,
            status: newStatus,
        };
        set((game) => ({
            cards: {
                ...game.cards,
                [cardId]: newCard,
            },
        }));

        return newStatus;
    }

    function setCardStatus(cardId: string, status: "correct" | "wrong" | null) {
        const card = get().cards[cardId];
        if (!card)
            throw new CardNotFoundError(cardId);

        set((game) => ({
            cards: {
                ...game.cards,
                [cardId]: {
                    ...card,
                    status,
                },
            },
        }));
    }

    function moveCardToSlot(movedCardId: string, targetCellId: string, targetSlotIndex: number) {
        const targetCell = get().cells[targetCellId];
        if (!targetCell)
            throw new CellNotFoundError(targetCellId);

        const cardIdInTargetSlot = targetCell.cardSlots[targetSlotIndex];
        if (cardIdInTargetSlot === movedCardId) {
            return;
        }

        const movedCard = get().cards[movedCardId];
        if (!movedCard)
            throw new CardNotFoundError(movedCardId);

        if (movedCard.cellId) {      // moved card is in a slot
            if (cardIdInTargetSlot) {       // target slot has a card in it
                // move the card that's currently in the target slot
                // into the slot the moved card currently occupies
                changeSlotContent(movedCard.cellId, movedCard.slotIndex, cardIdInTargetSlot);
                changeCardParent(cardIdInTargetSlot, movedCard.cellId, movedCard.slotIndex);

                setCardStatus(cardIdInTargetSlot, null);
            } else {
                // empty the slot that the moved card is currently in
                changeSlotContent(movedCard.cellId, movedCard.slotIndex, null);
            }
        } else {        // moved card is in the sidebar
            if (cardIdInTargetSlot) {       // target slot has a card in it
                // move the card that's currently in the target slot into the sidebar
                insertCardIntoSidebar(cardIdInTargetSlot);
                changeCardParent(cardIdInTargetSlot, null, -1);

                setCardStatus(cardIdInTargetSlot, null);
            }
            removeCardFromSidebar(movedCardId);
        }

        // move the card into the target slot
        changeSlotContent(targetCellId, targetSlotIndex, movedCardId);
        changeCardParent(movedCardId, targetCellId, targetSlotIndex);

        setCardStatus(movedCardId, null);
    }

    function moveCardToSidebar(cardId: string, beforeIndex?: number) {
        const game = get();

        const movedCard = game.cards[cardId];
        if (!movedCard)
            throw new CardNotFoundError(cardId);

        if (movedCard.cellId) {     // card is currently in a slot
            // empty the slot that the card is currently in
            changeSlotContent(movedCard.cellId, movedCard.slotIndex, null);
            insertCardIntoSidebar(cardId, beforeIndex);
            changeCardParent(cardId, null, -1);
        } else {        // card is in the sidebar
            removeCardFromSidebar(cardId);
            insertCardIntoSidebar(cardId, beforeIndex);
        }

        setCardStatus(cardId, null);
    }

    /** Inserts the specified card into the list of unused cards displayed in the sidebar,
     *  before the specified index.
     *  If the index is omitted, the card is placed at the end of the list.
     *  Only updates the list of unused cards. Does not update the state of the specified card. */
    function insertCardIntoSidebar(cardId: string, index?: number) {
        let newUnusedCardIds: string[];
        if (index === undefined) {
            newUnusedCardIds = [...get().unusedCardIds, cardId];
        } else {
            newUnusedCardIds = [...get().unusedCardIds];
            newUnusedCardIds.splice(index, 0, cardId);
        }

        set({
            unusedCardIds: newUnusedCardIds,
        });
    }

    /** Inserts the specified card from the list of unused cards displayed in the sidebar.
     *  Does not update the state of the specified card. */
    function removeCardFromSidebar(cardId: string) {
        set((game) => ({
            unusedCardIds: game.unusedCardIds
                .filter((id) => id !== cardId),
        }));
    }

    /** Updates the contents of the specified slot.
     *  Only updates the specified question. Does not update the state of the card that's being put into the slot. */
    function changeSlotContent(cellId: string, slotIndex: number, cardId: string | null) {
        const cell = get().cells[cellId];
        if (!cell)
            throw new CellNotFoundError(cellId);

        set((game) => ({
            cells: {
                ...game.cells,
                [cellId]: {
                    ...cell,
                    cardSlots: cell.cardSlots
                        .map((currentId, index) => (index === slotIndex) ? cardId : currentId),
                },
            },
        }));
    }

    /** Updates the parent of the specified card.
     *  Only updates the specified card. Does not update the state of the question. */
    function changeCardParent(cardId: string, cellId: string | null, slotIndex: number) {
        const card = get().cards[cardId];
        if (!card)
            throw new CardNotFoundError(cardId);

        set((game) => ({
            cards: {
                ...game.cards,
                [cardId]: {
                    ...card,
                    cellId,
                    slotIndex,
                },
            },
        }));
    }

    return { verify, moveCardToSlot, moveCardToSidebar };
}
