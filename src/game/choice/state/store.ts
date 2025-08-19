import { createGameStore, initialState } from "src/game/common";
import type { ChoiceGameStore } from "./types";

export const hook = createGameStore<ChoiceGameStore>({
    ...initialState,
    questions: [],
    current: 0,
    answered: 0,
});
