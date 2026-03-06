import type { GameAPICallbacks } from "src/game2/api";
import type { GameOptions } from "src/gameOptions";
import type { ZustandHook } from "src/utils/zustand";
import { describe, expect, it } from "vitest";
import { createAllActions } from "./actions";
import { createChoiceGameStore } from "./factory";
import { ChoiceScreenNotFoundError, type ChoiceGameStore } from "./types";

const someOptions: GameOptions = {
    gameType: "choiceGame",
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
function reachQuestionAtIndex(store: ZustandHook<ChoiceGameStore>, targetIndex: number = Infinity) {
    let index = 0;
    while (store.getState().api.state !== "finished" && index < targetIndex) {
        const currentScreenId = store.getState().currentScreenId;
        const currentScreen = store.getState().screens[currentScreenId];
        if (!currentScreen)
            throw new ChoiceScreenNotFoundError(currentScreenId);

        if (currentScreen.final)
            throw new Error("Somehow reached the end screen.");

        for (const buttonId of currentScreen.buttonIds) {
            if (store.getState().guess(buttonId) === "correct") {
                break;  // find the correct answer by clicking every button
            }
        }

        index++;
    }
}

describe("guess", () => {
    it("throws an error when the game is paused", async () => {
        const store = await createChoiceGameStore(someOptions, emptyCallbacks);

        store.getState().api.togglePause();     // pause the game
        expect(() => store.getState().guess(""))
            .toThrow("This action can only be performed while the game is unpaused.");
    });

    it("throws an error when the game is finished", async () => {
        const store = await createChoiceGameStore(someOptions, emptyCallbacks);
        reachQuestionAtIndex(store);

        expect(() => store.getState().guess(""))
            .toThrow("This action can only be performed while the game is unpaused.");
    });
});

describe("nextScreen", () => {
    it("throws an error when called on the results screen", async () => {
        const store = await createChoiceGameStore(someOptions, emptyCallbacks);
        reachQuestionAtIndex(store);

        const { nextScreen } = createAllActions(store.setState, store.getState);
        expect(() => nextScreen()).toThrow("This action cannot be performed when on the final screen.");
    });
});

describe("switchScreens", () => {
    it("throws an error when switching to a screen that hasn't been reached yet", async () => {
        const store = await createChoiceGameStore(someOptions, emptyCallbacks);
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
