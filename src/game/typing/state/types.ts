import type { Answer, GameStore, Question } from "src/game/common";
import type { TypingGameStoreActions } from "./actionFactory";
import type { StoreApi, UseBoundStore } from "zustand";

export type TypingGameStoreHook = UseBoundStore<StoreApi<TypingGameStore>>;

export interface TypingGameStore extends GameStore, TypingGameStoreActions {
    questions: Record<string, TypingQuestion | undefined>;
    answers: Record<string, TypingAnswer | undefined>;
    /** The title text shown on the game screen. */
    title: string;
}

export interface TypingQuestion extends Question {
    /** Number of correct answers provided by the user. */
    provided: number;
}

export interface TypingAnswer extends Answer {
    correct: true;
    /** Whether or not this answer has been guessed by the player. */
    guessed: boolean;
}

/** "correct" - the guess was correct.
 *  "alreadyGuessed" - the player provided the same answer that was correctly guessed earlier, again.
 *  "wrong" - the guess was incorrect. */
export type GuessResult = "correct" | "alreadyGuessed" | "wrong";
