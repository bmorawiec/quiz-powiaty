import { AnswerNotFoundError, QuestionNotFoundError } from "src/game/common";
import type { StoreApi } from "zustand";
import { CardNotFoundError, type DnDGameStore, type VerificationResult } from "./types";

export interface DnDGameStoreActions {
    /** Checks if each card is in the correct slot
     *  and assigns them "verification results" based on their correctness. */
    verify(): void;
    /** Moves the specified card to the specified slot.
     *  Swaps cards if the slot is already occupied. */
    moveCardToSlot(cardId: string, questionId: string, slotIndex: number): void;
    /** Moves the specified card to the sidebar.
     *  Swaps cards if the specified card is already in the sidebar. */
    moveCardToSidebar(cardId: string, beforeIndex?: number): void;
}

export function createDnDGameStoreActions(
    set: StoreApi<DnDGameStore>["setState"],
    get: StoreApi<DnDGameStore>["getState"],
): DnDGameStoreActions {
    function verify() {
        const game = get();

        let correctQuestionCount = 0;
        for (const questionId of game.questionIds) {
            const question = game.questions[questionId];
            if (!question)
                throw new QuestionNotFoundError(questionId);

            let correctCount = 0;
            let wrongCount = 0;
            for (const cardId of question.cardIds) {
                if (cardId) {
                    const result = verifyCard(cardId);
                    if (result === "correct") {
                        correctCount++;
                    } else if (result === "wrong") {
                        wrongCount++;
                    }

                    setCardResult(cardId, result);
                }
            }

            if (correctCount === question.answerIds.length) {   // all answers have been guessed
                correctQuestionCount++;
            } else if (wrongCount > 0) {
                increaseTryCount(questionId);
            }
        }

        if (correctQuestionCount === game.questionIds.length) {         // all questions have correct answers
            game.finish();
        }
    }

    /** Checks if the specified card is placed in the correct slot. */
    function verifyCard(cardId: string): VerificationResult {
        const game = get();

        const card = game.cards[cardId];
        if (!card)
            throw new CardNotFoundError(cardId);

        const answer = game.answers[cardId];
        if (!answer)
            throw new AnswerNotFoundError(cardId);

        if (card.questionId === answer.questionId) {
            return "correct";
        } else {
            return "wrong";
        }
    }

    /** Sets the verification result for the specified card. */
    function setCardResult(cardId: string, result: VerificationResult | null) {
        const game = get();

        const card = game.cards[cardId];
        if (!card)
            throw new CardNotFoundError(cardId);

        set({
            cards: {
                ...game.cards,
                [cardId]: {
                    ...card,
                    verificationResult: result,
                },
            },
        });
    }

    /** Increases the try counter for the specified question. */
    function increaseTryCount(questionId: string) {
        const game = get();

        const question = game.questions[questionId];
        if (!question)
            throw new QuestionNotFoundError(questionId);

        set({
            questions: {
                ...game.questions,
                [questionId]: {
                    ...question,
                    tries: question.tries + 1,
                },
            },
        });
    }

    function moveCardToSlot(movedCardId: string, targetQuestionId: string, targetSlotIndex: number) {
        const game = get();

        const targetQuestion = game.questions[targetQuestionId];
        if (!targetQuestion)
            throw new QuestionNotFoundError(targetQuestionId);

        const cardIdInTargetSlot = targetQuestion.cardIds[targetSlotIndex];
        if (cardIdInTargetSlot === movedCardId) {
            return;
        }

        const movedCard = game.cards[movedCardId];
        if (!movedCard)
            throw new CardNotFoundError(movedCardId);

        if (movedCard.questionId) {      // moved card is in a slot
            if (cardIdInTargetSlot) {       // target slot has a card in it
                // move the card that's currently in the target slot
                // into the slot the moved card currently occupies
                changeSlotContent(movedCard.questionId, movedCard.slotIndex, cardIdInTargetSlot);
                changeCardParent(cardIdInTargetSlot, movedCard.questionId, movedCard.slotIndex);

                setCardResult(cardIdInTargetSlot, null);
            } else {
                // empty the slot that the moved card is currently in
                changeSlotContent(movedCard.questionId, movedCard.slotIndex, null);
            }
        } else {        // moved card is in the sidebar
            if (cardIdInTargetSlot) {       // target slot has a card in it
                // move the card that's currently in the target slot into the sidebar
                insertCardIntoSidebar(cardIdInTargetSlot);
                changeCardParent(cardIdInTargetSlot, null, -1);
            }
            removeCardFromSidebar(movedCardId);
        }

        // move the card into the target slot
        changeSlotContent(targetQuestionId, targetSlotIndex, movedCardId);
        changeCardParent(movedCardId, targetQuestionId, targetSlotIndex);

        setCardResult(movedCardId, null);
    }

    function moveCardToSidebar(cardId: string, beforeIndex?: number) {
        const game = get();

        const movedCard = game.cards[cardId];
        if (!movedCard)
            throw new CardNotFoundError(cardId);

        if (movedCard.questionId) {     // card is currently in a slot
            // empty the slot that the card is currently in
            changeSlotContent(movedCard.questionId, movedCard.slotIndex, null);
            insertCardIntoSidebar(cardId, beforeIndex);
            changeCardParent(cardId, null, -1);
        } else {        // card is in the sidebar
            removeCardFromSidebar(cardId);
            insertCardIntoSidebar(cardId, beforeIndex);
        }

        setCardResult(cardId, null);
    }

    /** Inserts the specified card into the list of unused cards displayed in the sidebar,
     *  before the specified index.
     *  If the index is omitted, the card is placed at the end of the list.
     *  Only updates the list of unused cards. Does not update the state of the specified card. */
    function insertCardIntoSidebar(cardId: string, index?: number) {
        const game = get();

        let newUnusedCardIds: string[];
        if (index === undefined) {
            newUnusedCardIds = [...game.unusedCardIds, cardId];
        } else {
            newUnusedCardIds = [...game.unusedCardIds];
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
    function changeSlotContent(questionId: string, slotIndex: number, cardId: string | null) {
        const game = get();

        const question = game.questions[questionId];
        if (!question)
            throw new QuestionNotFoundError(questionId);

        set({
            questions: {
                ...game.questions,
                [questionId]: {
                    ...question,
                    cardIds: question.cardIds
                        .map((currentId, index) => (index === slotIndex) ? cardId : currentId),
                },
            },
        });
    }

    /** Updates the parent of the specified card.
     *  Only updates the specified card. Does not update the state of the question. */
    function changeCardParent(cardId: string, questionId: string | null, slotIndex: number) {
        const game = get();

        const card = game.cards[cardId];
        if (!card)
            throw new CardNotFoundError(cardId);

        set({
            cards: {
                ...game.cards,
                [cardId]: {
                    ...card,
                    questionId,
                    slotIndex,
                },
            },
        });
    }

    return { verify, moveCardToSlot, moveCardToSidebar };
}
