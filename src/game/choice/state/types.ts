import type { StoreApi, UseBoundStore } from "zustand";
import type { Answer, GameStore, Question } from "../../common";
import type { ChoiceGameStoreActions } from "./actionFactory";

export type ChoiceGameStoreHook = UseBoundStore<StoreApi<ChoiceGameStore>>;

export interface ChoiceGameStore extends GameStore, ChoiceGameStoreActions {
    /** The title text shown on the game screen. */
    title?: string;
    /** Stores the order and states of all the questions that are going to be presented in this game. */
    questions: ChoiceQuestion[];
    /** Index of the current question */
    current: number;
    /** Total number of answered questions */
    answered: number;
}

export interface ChoiceQuestion extends Question {
    /** Contains all the correct and incorrect options that will be shown when this question
     *  is presented. There are always six options. */
    answers: ChoiceAnswer[];
}

export type ChoiceAnswer = Answer;

/** "correct" - the guess was correct.
 *  "wrong" - the guess was incorrect. */
export type GuessResult = "correct" | "wrong";
