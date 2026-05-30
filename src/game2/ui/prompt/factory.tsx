import type { ComponentType } from "react";
import type { GameAPICallbacks } from "src/game2/api";
import type { GameOptions } from "src/game2/options";
import type { Answers, Questions } from "src/game2/questions";
import { createPromptGameStore, type PromptGameStore } from "src/game2/state";
import type { ZustandHook } from "src/utils/zustand";
import { PromptGame } from "./PromptGame";
import { PromptGameStoreContext } from "./hook";

/** Creates a game store and a game component.
 *  @returns a tuple containing both values */
export async function createPromptGame(
    questionsAndAnswers: Questions & Answers,
    options: GameOptions,
    callbacks: GameAPICallbacks,
): Promise<[ComponentType, ZustandHook<PromptGameStore>]> {
    const usePromptGameStore = await createPromptGameStore(questionsAndAnswers, options, callbacks);

    function PromptGameWrapper() {
        return (
            <PromptGameStoreContext value={usePromptGameStore}>
                <PromptGame/>
            </PromptGameStoreContext>
        );
    };

    return [PromptGameWrapper, usePromptGameStore];
}
