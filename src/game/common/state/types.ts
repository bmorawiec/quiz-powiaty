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

export type GameState = "unstarted" | "unpaused" | "paused" | "finished" | "invalid";
