import { create, type StoreApi, type UseBoundStore } from "zustand";
import type { GameStore } from "./types";

export const initialState: GameStore = {
    state: "unstarted",
    timestamps: [],
    options: {
        gameType: "mapGame",
        unitType: "county",
        guessFrom: "name",
        guess: "map",
        filters: [],
    },
};

export function createGameStore<TGameStore extends GameStore>(
    initialState: TGameStore,
): UseBoundStore<StoreApi<TGameStore>> {
    return create(() => initialState);
}
