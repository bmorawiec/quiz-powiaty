import type { Answer, GameStore, Question } from "../../common";

export interface PromptGameStore extends GameStore {
    /** Stores the order and states of all the prompts that are going to be presented in this game. */
    prompts: PromptQuestion[];
    /** Index of the current prompt */
    current: number;
    /** Total number of answered prompts */
    answered: number;
}

export interface PromptQuestion extends Question {
    /** Stores correct answers to this prompt. */
    answers: PromptAnswer[];
    /** Number of correct answers provided by the user. */
    provided: number;
    /** The amount of times the player has attempted to answer this prompt. */
    tries: number;
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
