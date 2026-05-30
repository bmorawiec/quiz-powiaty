import type { ComponentType } from "react";
import type { GameAPICallbacks } from "src/game2/api";
import type { GameOptions } from "src/game2/options";
import type { Answers, Questions } from "src/game2/questions";
import { createDnDGameStore, type DnDGameStore } from "src/game2/state";
import type { ZustandHook } from "src/utils/zustand";
import { DnDGame } from "./DnDGame";
import { DnDGameStoreContext } from "./hook";

export async function createDnDGame(
    questionsAndAnswers: Questions & Answers,
    options: GameOptions,
    callbacks: GameAPICallbacks,
): Promise<[ComponentType, ZustandHook<DnDGameStore>]> {
    const useDnDGameStore = await createDnDGameStore(questionsAndAnswers, options, callbacks);

    function DnDGameWrapper() {
        return (
            <DnDGameStoreContext value={useDnDGameStore}>
                <DnDGame/>
            </DnDGameStoreContext>
        );
    };

    return [DnDGameWrapper, useDnDGameStore];
}
