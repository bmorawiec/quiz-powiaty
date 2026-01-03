import type { ComponentType } from "react";
import { type DnDGameStore, createDnDGameStore } from "src/game2/state";
import type { GameOptions } from "src/gameOptions";
import type { ZustandHook } from "src/utils/zustand";
import { DnDGame } from "./DnDGame";
import { DnDGameStoreContext } from "./hook";

export async function createDnDGame(
    options: GameOptions,
    onRestart: () => void,
): Promise<[ComponentType, ZustandHook<DnDGameStore>]> {
    const useDnDGameStore = await createDnDGameStore(options, onRestart);

    function DnDGameWrapper() {
        return (
            <DnDGameStoreContext value={useDnDGameStore}>
                <DnDGame/>
            </DnDGameStoreContext>
        );
    };

    return [DnDGameWrapper, useDnDGameStore];
}
