import { create, type StoreApi } from "zustand";
import type { GameStore } from "./types";

export function createGameStore<TGameStore extends GameStore>(
    initializer: (
        set: StoreApi<TGameStore>["setState"],
        get: StoreApi<TGameStore>["getState"],
    ) => TGameStore,
) {
    return create<TGameStore>()(initializer);
}
