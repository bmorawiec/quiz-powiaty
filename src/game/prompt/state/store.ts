import { createGameStore, initialState } from "src/game/common";
import type { PromptGameStore } from "./types";

export const hook = createGameStore<PromptGameStore>({
    ...initialState,
    prompts: {
        ids: [],
        states: {},
        current: "",
        answered: 0,
        total: 0,
    },
});
