import type { StoreApi } from "zustand";
import type { GameStore } from "./types";

export interface GameStoreActions {
    /** Sets the state of the game to "finished".
     *  @throws if the game has been finished */
    finish: () => void;

    /** Pauses the game if it's currently unpaused. Unpauses the game if it's currently paused.
      * @throws if the game has been finished */
    togglePause: () => void;

    /** Calculates the time the game has been running for unpaused. */
    calculateTime: () => number;
}

export function createGameStoreActions(
    set: StoreApi<GameStore>["setState"],
    get: StoreApi<GameStore>["getState"],
): GameStoreActions {
    function finish() {
        const game = get();
        if (game.state === "finished")
            throw new Error("This action may only be performed before the game is finished.");

        set({
            state: "finished",
            timestamps: [...game.timestamps, Date.now()],
        });
    }

    function togglePause() {
        const game = get();
        if (game.state === "finished")
            throw new Error("Cannot pause or unpause a finished game.");

        set({
            state: (game.state === "paused") ? "unpaused" : "paused",
            timestamps: [...game.timestamps, Date.now()],
        });
    }

    function calculateTime(): number {
        const game = get();

        let time = 0;
        const timestamps = (game.state === "unpaused")
            ? [...game.timestamps, Date.now()]
            : game.timestamps;
        for (let index = 0; index < timestamps.length; index += 2) {
            const unpausedAt = timestamps[index];
            const pausedAt = timestamps[index + 1];

            const timeDiff = pausedAt - unpausedAt;
            time += timeDiff;
        }

        return time;
    }

    return { finish, togglePause, calculateTime };
}
