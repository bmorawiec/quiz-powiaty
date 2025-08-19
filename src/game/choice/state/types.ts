import type { GameStore } from "src/game/common";

export interface ChoiceGameStore extends GameStore {
    /** Stores the order and states of all the questions that are going to be presented in this game. */
    questions: Question[];
    /** Index of the current question */
    current: number;
    /** Total number of answered questions */
    answered: number;
}

/** Stores information about a question. */
export interface Question {
    /** TERC code of the administrative unit this question is about. */
    about: string;
    /** The string to be shown when this question is presented. */
    value: string;
    /** Contains all the correct and incorrect options that will be shown when this question
     *  is presented. There are always six options. */
    options: QuestionOption[];
    /** The amount of times the player has attempted to answer this prompt. */
    tries: number;
}

export interface QuestionOption {
    id: string;
    /** Whether or not this option is the correct answer to the question. */
    correct: boolean;
    value: string;
}

/** "correct" - the guess was correct.
 *  "wrong" - the guess was incorrect. */
export type GuessResult = "correct" | "wrong";
