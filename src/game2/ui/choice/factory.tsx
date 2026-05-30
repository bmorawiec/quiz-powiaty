import type { ComponentType } from "react";
import type { GameAPICallbacks } from "src/game2/api";
import type { GameOptions } from "src/game2/options";
import type { Answers, Questions } from "src/game2/questions";
import { createChoiceGameStore, type ChoiceGameStore } from "src/game2/state";
import type { ZustandHook } from "src/utils/zustand";
import { ChoiceGame } from "./ChoiceGame";
import { ChoiceGameStoreContext } from "./hook";

/** Creates a game store and a game component.
 *  @returns a tuple containing both values */
export async function createChoiceGame(
    questionsAndAnswers: Questions & Answers,
    options: GameOptions,
    callbacks: GameAPICallbacks,
): Promise<[ComponentType, ZustandHook<ChoiceGameStore>]> {
    const useChoiceGameStore = await createChoiceGameStore(questionsAndAnswers, options, callbacks);

    function ChoiceGameWrapper() {
        return (
            <ChoiceGameStoreContext value={useChoiceGameStore}>
                <ChoiceGame/>
            </ChoiceGameStoreContext>
        );
    };

    return [ChoiceGameWrapper, useChoiceGameStore];
}
