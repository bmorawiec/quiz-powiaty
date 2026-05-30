import type { ComponentType } from "react";
import type { GameOptions } from "src/game2/options";
import type { GameStore } from "src/game2/state";
import type { ZustandHook } from "src/utils/zustand";
import type { GameAPICallbacks } from "../api";
import type { Answers, Questions } from "../questions";

/** Creates a game store and component of the correct type, depending on the game options. */
export async function createGame(
    questionsAndAnswers: Questions & Answers,
    options: GameOptions,
    callbacks: GameAPICallbacks,
): Promise<[ComponentType, ZustandHook<GameStore>]> {
    if (options.mode === "choiceGame") {
        const { createChoiceGame } = await import("./choice");
        return createChoiceGame(questionsAndAnswers, options, callbacks);
    } else if (options.mode === "dndGame") {
        const { createDnDGame } = await import("./dnd");
        return createDnDGame(questionsAndAnswers, options, callbacks);
    } else if (options.mode === "promptGame") {
        const { createPromptGame } = await import("./prompt");
        return createPromptGame(questionsAndAnswers, options, callbacks);
    }
    throw new Error("Unknown game mode: " + options.mode);
}
