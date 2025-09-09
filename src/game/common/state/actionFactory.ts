import type { StoreApi, UseBoundStore } from "zustand";
import type { GameStore } from "./types";

export function createActions(hook: UseBoundStore<StoreApi<GameStore>>) {
    /** Resets the game to the "unstarted" state. */
    function resetGame() {
        hook.setState({
            state: "unstarted",
            timestamps: [],
        });
    }

    /** Sets the state of the game to "finished".
     *  @throws if the game hasn't been started, if it's starting or if it has finished. */
    function finishGame() {
        const game = hook.getState();
        if (game.state === "unstarted" || game.state === "starting" || game.state === "finished")
            throw new Error("This action may only be performed after the game is started and before it is finished.");

        hook.setState({
            state: "finished",
            timestamps: [...game.timestamps, Date.now()],
        });
    }

    /** Pauses the game if it's currently unpaused. Unpauses the game if it's currently paused.
      * @throws if the game hasn't been started yet, if it's starting or if it has finished. */
    function togglePause() {
        const game = hook.getState();
        if (game.state === "unstarted" || game.state === "starting" || game.state === "finished")
            throw new Error("Cannot pause or unpause an unstarted or finished game.");

        const newState = (game.state === "paused") ? "unpaused" : "paused";
        const timestamp = Date.now();
        hook.setState({
            state: newState,
            timestamps: [...game.timestamps, timestamp],
        });
    }

    /** Calculates the time the game has been running for unpaused.
     *  Returns zero for unstarted and starting games. */
    function calculateTime(): number {
        const game = hook.getState();
        if (game.state === "unstarted" || game.state === "starting") {
            return 0;
        }

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

    return { resetGame, finishGame, togglePause, calculateTime };
}
