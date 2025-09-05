import { createGameStore, initialState } from "../../common";
import type { TypingGameStore } from "./types";

export const hook = createGameStore<TypingGameStore>({
    ...initialState,
    title: "",
    questions: [],
    answered: 0,
});
