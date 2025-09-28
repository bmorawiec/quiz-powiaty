import type { StoreApi, UseBoundStore } from "zustand";
import type { Answer, GameStore, Question } from "../../common";
import type { ChoiceGameStoreActions } from "./actionFactory";

export type ChoiceGameStoreHook = UseBoundStore<StoreApi<ChoiceGameStore>>;

export interface ChoiceGameStore extends GameStore, ChoiceGameStoreActions {
    questions: Record<string, ChoiceQuestion | undefined>;
    answers: Record<string, ChoiceAnswer | undefined>;
    /** The title text shown on the game screen. */
    title?: string;
    /** Id of the current question. */
    current: string;
    /** Total number of answered questions */
    answered: number;
}

export type ChoiceQuestion = Question;

export type ChoiceAnswer = Answer;

/** "correct" - the guess was correct.
 *  "wrong" - the guess was incorrect. */
export type GuessResult = "correct" | "wrong";
