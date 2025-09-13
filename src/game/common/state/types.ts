import type { GameOptions } from "src/gameOptions";
import type { GameStoreActions } from "./actionFactory";

export interface GameStore extends GameStoreActions {
    /** Current state of the game */
    state: GameState;
    /** Timestamps, at which the game was either paused or unpaused.
     *  When the game is...
     *   - paused or finished, the array should contain an even amount of entries.
     *   - unpaused, the array should contain an odd amount of entries.
     *   - unstarted or starting, the array should be empty. */
    timestamps: number[];
    options: GameOptions;
}

export type GameState = "unpaused" | "paused" | "finished";

export interface Question {
    /** TERC id of the administrative unit this question is about. */
    id: string;
    /** Contains either text or the URL of an image to be shown when this question is presented. */
    value: string;
    /** The amount of times the player has attempted to answer this question. */
    tries: number;
    answers: Answer[];
}

export interface Answer {
    /** TERC id of the administrative unit this answer is about. MAY NOT BE UNIQUE. */
    id: string;
    /** Contains either text or the URL of an image to be shown when this answer is presented. */
    value: string;
    correct: boolean;
}
