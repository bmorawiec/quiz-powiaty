import { createGameStore, initialState } from "../../common";
import type { PromptGameStore } from "./types";

export const hook = createGameStore<PromptGameStore>({
    ...initialState,
    prompts: [],
    current: 0,
    answered: 0,
});
