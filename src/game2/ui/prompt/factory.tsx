import type { ComponentType } from "react";
import { type PromptGameStore, createPromptGameStore } from "src/game2/state";
import type { GameOptions } from "src/gameOptions";
import type { ZustandHook } from "src/utils/zustand";
import { PromptGame } from "./PromptGame";
import { PromptGameStoreContext } from "./hook";

/** Creates a game store and a game component.
 *  @returns a tuple containing both values */
export async function createPromptGame(
    options: GameOptions,
    onRestart: () => void,
): Promise<[ComponentType, ZustandHook<PromptGameStore>]> {
    const usePromptGameStore = await createPromptGameStore(options, onRestart);

    function PromptGameWrapper() {
        return (
            <PromptGameStoreContext value={usePromptGameStore}>
                <PromptGame/>
            </PromptGameStoreContext>
        );
    };

    return [PromptGameWrapper, usePromptGameStore];
}
