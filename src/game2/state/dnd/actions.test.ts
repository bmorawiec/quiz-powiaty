import { QuestionNotFoundError, type GameAPICallbacks } from "src/game2/api";
import type { GameOptions } from "src/gameOptions";
import type { ZustandHook } from "src/utils/zustand";
import { describe, expect, it } from "vitest";
import { createDnDGameStore } from "./factory";
import { CellNotFoundError, type DnDGameStore } from "./types";
import { CardNotFoundError } from "src/game/dnd";

const someOptions: GameOptions = {
    gameType: "dndGame",
    unitType: "county",
    guessFrom: "plate",
    guess: "capital",
    maxQuestions: 20,
    filters: {
        countyTypes: [],
        voivodeships: [],
    },
};

const emptyCallbacks: GameAPICallbacks = {
    onRestart: () => {},
    onToggleFullscreen: () => {},
};

/** Simulates a player finishing a game and getting to the results screen. */
function finishGame(store: ZustandHook<DnDGameStore>) {
    for (const cellId of store.getState().cellIds) {
        const cell = store.getState().cells[cellId];
        if (!cell) throw new CellNotFoundError(cellId);

        const question = store.getState().api.questions[cell.questionId];
        if (!question) throw new QuestionNotFoundError(cell.questionId);

        let firstEmptySlotIndex = 0;
        for (const cardId of store.getState().cardIds) {
            const card = store.getState().cards[cardId];
            if (!card) throw new CardNotFoundError(cardId);

            if (question.answerIds.includes(card.answerId)) {
                // this card should be placed in one of the slots of this cell
                store.getState().moveCardToSlot(cardId, cellId, firstEmptySlotIndex);
                firstEmptySlotIndex++;
            }
        }
    }

    store.getState().verify();
}

describe("verify", () => {
    it("throws an error when the game is paused", async () => {
        const store = await createDnDGameStore(someOptions, emptyCallbacks);

        store.getState().api.togglePause();
        expect(() => store.getState().verify())
            .toThrow("Cannot perform this action while the game is paused or finished.");
    });

    it("throws an error when the game is finished", async () => {
        const store = await createDnDGameStore(someOptions, emptyCallbacks);

        finishGame(store);
        expect(() => store.getState().verify())
            .toThrow("Cannot perform this action while the game is paused or finished.");
    });
});

describe("moveCardToSlot", () => {
    it("throws an error when the game is paused", async () => {
        const store = await createDnDGameStore(someOptions, emptyCallbacks);

        store.getState().api.togglePause();

        const cardId = store.getState().cardIds[0];
        const cellId = store.getState().cellIds[0];
        expect(() => store.getState().moveCardToSlot(cardId, cellId, 0))
            .toThrow("Cannot perform this action while the game is paused or finished.");
    });

    it("throws an error when the game is finished", async () => {
        const store = await createDnDGameStore(someOptions, emptyCallbacks);

        finishGame(store);

        const cardId = store.getState().cardIds[0];
        const cellId = store.getState().cellIds[0];
        expect(() => store.getState().moveCardToSlot(cardId, cellId, 0))
            .toThrow("Cannot perform this action while the game is paused or finished.");
    });

    it("throws when moving a card that has been verified", async () => {
        const store = await createDnDGameStore(someOptions, emptyCallbacks);

        const firstCellId = store.getState().cellIds[0];
        const firstCell = store.getState().cells[firstCellId];
        if (!firstCell) throw new CellNotFoundError(firstCellId);

        const secondCellId = store.getState().cellIds[1];

        const firstCellQuestion = store.getState().api.questions[firstCell.questionId];
        if (!firstCellQuestion) throw new QuestionNotFoundError(firstCell.questionId);

        const cardId = store.getState().cardIds.find((cardId) => {
            const card = store.getState().cards[cardId];
            if (!card) throw new CardNotFoundError(cardId);

            return firstCellQuestion.answerIds.includes(card.answerId);
        });
        if (!cardId)
            throw new Error("Couldn't find a matching card for this cell.");

        store.getState().moveCardToSlot(cardId, firstCellId, 0);
        store.getState().verify();

        expect(() => store.getState().moveCardToSlot(cardId, secondCellId, 0))
            .toThrow("Cards that have been verified cannot be moved.");
    });
});

describe("moveCardToSidebar", () => {
    it("throws an error when the game is paused", async () => {
        const store = await createDnDGameStore(someOptions, emptyCallbacks);

        store.getState().api.togglePause();

        const cardId = store.getState().cardIds[0];
        expect(() => store.getState().moveCardToSidebar(cardId))
            .toThrow("Cannot perform this action while the game is paused or finished.");
    });

    it("throws an error when the game is finished", async () => {
        const store = await createDnDGameStore(someOptions, emptyCallbacks);

        finishGame(store);

        const cardId = store.getState().cardIds[0];
        expect(() => store.getState().moveCardToSidebar(cardId))
            .toThrow("Cannot perform this action while the game is paused or finished.");
    });

    it("throws when moving a card that has been verified", async () => {
        const store = await createDnDGameStore(someOptions, emptyCallbacks);

        const firstCellId = store.getState().cellIds[0];
        const firstCell = store.getState().cells[firstCellId];
        if (!firstCell) throw new CellNotFoundError(firstCellId);

        const firstCellQuestion = store.getState().api.questions[firstCell.questionId];
        if (!firstCellQuestion) throw new QuestionNotFoundError(firstCell.questionId);

        const cardId = store.getState().cardIds.find((cardId) => {
            const card = store.getState().cards[cardId];
            if (!card) throw new CardNotFoundError(cardId);

            return firstCellQuestion.answerIds.includes(card.answerId);
        });
        if (!cardId)
            throw new Error("Couldn't find a matching card for this cell.");

        store.getState().moveCardToSlot(cardId, firstCellId, 0);
        store.getState().verify();

        expect(() => store.getState().moveCardToSidebar(cardId))
            .toThrow("Cards that have been verified cannot be moved.");
    });
});
