import type { ComponentType } from "react";
import { type ChoiceGameStore, createChoiceGameStore } from "src/game2/state";
import type { GameOptions } from "src/gameOptions";
import type { ZustandHook } from "src/utils/zustand";
import { ChoiceGame } from "./ChoiceGame";
import { ChoiceGameStoreContext } from "./hook";

/** Creates a game store and a game component.
 *  @returns a tuple containing both values */
export async function createChoiceGame(options: GameOptions): Promise<[ComponentType, ZustandHook<ChoiceGameStore>]> {
    const useChoiceGameStore = await createChoiceGameStore(options);

    function ChoiceGameWrapper() {
        return (
            <ChoiceGameStoreContext value={useChoiceGameStore}>
                <ChoiceGame/>
            </ChoiceGameStoreContext>
        );
    };

    return [ChoiceGameWrapper, useChoiceGameStore];
}
