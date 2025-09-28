import type { StoreApi, UseBoundStore } from "zustand";
import type { Answer, GameStore, Question } from "../../common";
import type { PromptGameStoreActions } from "./actionFactory";

export type PromptGameStoreHook = UseBoundStore<StoreApi<PromptGameStore>>;

export interface PromptGameStore extends GameStore, PromptGameStoreActions {
    questions: Record<string, PromptQuestion | undefined>;
    answers: Record<string, PromptAnswer | undefined>;
    /** The title text shown on the game screen. */
    title?: string;
    /** Id of the current question. */
    current: string;
    /** Total number of answered questions. */
    answered: number;
}

export interface PromptQuestion extends Question {
    /** Number of correct answers provided by the user. */
    provided: number;
}

export interface PromptAnswer extends Answer {
    correct: true;
    /** Whether or not this answer has been guessed by the player. */
    guessed: boolean;
}

/** "correct" - the guess was correct.
 *  "alreadyGuessed" - the player provided the same answer that was correctly guessed earlier, again.
 *  "wrong" - the guess was incorrect. */
export type GuessResult = "correct" | "alreadyGuessed" | "wrong";
