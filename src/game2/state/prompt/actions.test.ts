import { AnswerNotFoundError } from "src/game/common";
import { type GameAPICallbacks } from "src/game2/api";
import type { GameOptions } from "src/gameOptions";
import type { ZustandHook } from "src/utils/zustand";
import { describe, expect, it } from "vitest";
import { createAllActions } from "./actions";
import { createPromptGameStore } from "./factory";
import { PromptScreenNotFoundError, type PromptGameStore } from "./types";
import { QuestionNotFoundError } from "src/game2/questions";

const someOptions: GameOptions = {
    gameType: "promptGame",
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

/** Simulates a player getting to a question with the specified index.
 *  If the index is omitted, then the final screen will be reached. */
function reachQuestionAtIndex(store: ZustandHook<PromptGameStore>, targetIndex: number = Infinity) {
    let index = 0;
    while (store.getState().api.state !== "finished" && index < targetIndex) {
        const currentScreenId = store.getState().currentScreenId;
        const currentScreen = store.getState().screens[currentScreenId];
        if (!currentScreen)
            throw new PromptScreenNotFoundError(currentScreenId);

        if (currentScreen.final)
            throw new Error("Loop should have terminated before this screen was reached.");

        const question = store.getState().api.questions[currentScreen.questionId];
        if (!question)
            throw new QuestionNotFoundError(currentScreen.questionId);

        for (const answerId of question.answerIds) {
            const answer = store.getState().api.answers[answerId];
            if (!answer)
                throw new AnswerNotFoundError(answerId);

            if (answer.content.type !== "text")
                throw new Error("Expected answer content to be of type 'text'.");

            store.getState().guess(answer.content.text);
        }

        index++;
    }
}

describe("guess", () => {
    it("throws an error when the game is paused", async () => {
        const store = await createPromptGameStore(someOptions, emptyCallbacks);

        store.getState().api.togglePause();     // pause the game
        expect(() => store.getState().guess(""))
            .toThrow("Cannot perform this action while the game is paused or finished.");
    });

    it("throws an error when the game is finished", async () => {
        const store = await createPromptGameStore(someOptions, emptyCallbacks);
        reachQuestionAtIndex(store);

        expect(() => store.getState().guess(""))
            .toThrow("Cannot perform this action while the game is paused or finished.");
    });
});

describe("nextScreen", () => {
    it("throws an error when called on the results screen", async () => {
        const store = await createPromptGameStore(someOptions, emptyCallbacks);
        reachQuestionAtIndex(store);

        const { nextScreen } = createAllActions(store.setState, store.getState);
        expect(() => nextScreen()).toThrow("This action cannot be performed when on the final screen.");
    });
});

describe("switchScreens", () => {
    it("throws an error when switching to a screen that hasn't been reached yet", async () => {
        const store = await createPromptGameStore(someOptions, emptyCallbacks);
        reachQuestionAtIndex(store, 10);

        expect(() => store.getState().switchScreens(store.getState().screenIds[5])).not.toThrow();
        expect(() => store.getState().switchScreens(store.getState().screenIds[10])).not.toThrow();

        // currently at screen 10, so these should throw
        expect(() => store.getState().switchScreens(store.getState().screenIds[11]))
            .toThrow("This action cannot be performed until all the questions before this one are answered.");
        expect(() => store.getState().switchScreens(store.getState().screenIds[19]))
            .toThrow("This action cannot be performed until all the questions before this one are answered.");
    });
});
