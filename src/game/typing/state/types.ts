import type { Answer, GameStore, Question } from "src/game/common";
import type { TypingGameStoreActions } from "./actionFactory";
import type { StoreApi, UseBoundStore } from "zustand";

export type TypingGameStoreHook = UseBoundStore<StoreApi<TypingGameStore>>;

export interface TypingGameStore extends GameStore, TypingGameStoreActions {
    /** The title text shown on the game screen. */
    title: string;
    /** Stores the order and states of all the questions that are going to be presented in this game.
     *  These are shown in the form of a table or a grid, where each question corresponds to a row or cell. */
    questions: TypingQuestion[];
    answered: number;
}

export interface TypingQuestion extends Question {
    /** Stores correct answers to this question. */
    answers: TypingAnswer[];
    /** Number of correct answers provided by the user. */
    provided: number;
}

export interface TypingAnswer extends Answer {
    correct: true;
    /** Whether or not this answer has been guessed by the player. */
    guessed: boolean;
    /** When there are multiple answers, this number determines which slot the correct answer will appear in.
     *  For example, if the user typed the answer into the 2nd input, then the correct answer should appear there.
     *  Set to -1 for unguessed answers. */
    slotIndex: number;
}

/** "correct" - the guess was correct.
 *  "alreadyGuessed" - the player provided the same answer that was correctly guessed earlier, again.
 *  "wrong" - the guess was incorrect. */
export type GuessResult = "correct" | "alreadyGuessed" | "wrong";
