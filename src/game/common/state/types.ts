import type { GameOptions } from "src/gameOptions";

export interface GameStore {
    /** Current state of the game */
    state: GameState;
    /** Timestamps, at which the game was either paused or unpaused.
     *  When the game is...
     *   - paused or finished, the array should contain an even amount of entries.
     *   - unpaused, the array should contain an odd amount of entries.
     *   - unstarted, the array should be empty. */
    timestamps: number[];
    options: GameOptions;
}

export type GameState = "unstarted" | "unpaused" | "paused" | "finished";

export interface Question {
    /** TERC id of the administrative unit this question is about. */
    id: string;
    text?: string;
    /** URL of image to be shown when this question is presented. */
    imageURL?: string;
    /** The amount of times the player has attempted to answer this question. */
    tries: number;
    answers: Answer[];
}

export interface Answer {
    /** TERC id of the administrative unit this answer is about. */
    id: string;
    text?: string;
    /** URL of image to be shown when this answer is presented. */
    imageURL?: string;
    correct: boolean;
}
