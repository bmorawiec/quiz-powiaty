import type { GameStore } from "src/game/common";

export interface PromptGameStore extends GameStore {
    /** Stores the order and states of all the prompts that are going to be presented in this game. */
    prompts: {
        ids: string[];
        states: Record<string, PromptState | undefined>;
        /** TERC code associated with the currently displayed prompt. */
        current: string;
        /** Total number of answered prompts */
        answered: number;
        /** Total number of prompts */
        total: number;
    };
}

/** Represents a prompt.
 *  Each prompt corresponds to an administrative unit. */
export interface PromptState {
    /** TERC code of the administrative unit this question is about. */
    id: string;
    /** "unanswered" - This prompt hasn't been answered yet.
     *  "answering" - This prompt is visible and is being answered right now.
     *  "answered" - This prompt has been correctly answered. */
    state: "unanswered" | "answering" | "answered";
    /** Stores values of all the correct guesses the user has made. */
    correctGuesses: string[];
    /** The amount of times the player has attempted to answer this question. */
    tries: number;
}

/** "correct" - the guess was correct.
 *  "alreadyGuessed" - the player provided the same answer that was correctly guessed earlier, again.
 *  "wrong" - the guess was incorrect. */
export type GuessResult = "correct" | "alreadyGuessed" | "wrong";
