import { create, type StoreApi } from "zustand";
import type { GameStore } from "./types";

export function getInitialGameStoreState() {
    return {
        state: "unpaused",
        timestamps: [Date.now()],
        answered: 0,
    } satisfies Partial<GameStore>;
}

export function createGameStore<TGameStore extends GameStore>(
    initializer: (
        set: StoreApi<TGameStore>["setState"],
        get: StoreApi<TGameStore>["getState"],
    ) => TGameStore,
) {
    return create<TGameStore>()(initializer);
}
