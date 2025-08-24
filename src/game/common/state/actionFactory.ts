import type { GameOptions } from "src/gameOptions";
import type { StoreApi, UseBoundStore } from "zustand";
import type { GameStore } from "./types";

export function createActions(hook: UseBoundStore<StoreApi<GameStore>>) {
    /** Unpauses the game and sets game options. */
    function initializeGame(options: GameOptions) {
        hook.setState({
            state: "unpaused",
            timestamps: [Date.now()],
            options,
        });
    }

    function finishGame() {
        const game = hook.getState();
        hook.setState({
            state: "finished",
            timestamps: [...game.timestamps, Date.now()],
        });
    }

    /** Sets the game state to "invalid" */
    function setInvalidState() {
        hook.setState({ state: "invalid" });
    }

    /** Pauses the game if it's currently unpaused. Unpauses the game if it's currently paused.
      * @throws if the game hasn't been started yet, or if it has finished. */
    function togglePause() {
        const game = hook.getState();
        if (game.state === "unstarted" || game.state === "finished" || game.state === "invalid")
            throw new Error("Cannot pause or unpause an unstarted, finished or invalid game.");

        const newState = (game.state === "paused") ? "unpaused" : "paused";
        const timestamp = Date.now();
        hook.setState({
            state: newState,
            timestamps: [...game.timestamps, timestamp],
        });
    }

    /** Calculates the time the game has been running for unpaused.
      * @throws if the game hasn't been started yet, or if it has finished. */
    function calculateTime(): number {
        const game = hook.getState();
        if (game.state === "unstarted" || game.state === "finished" || game.state === "invalid")
            throw new Error("Cannot calculate the time for an unstarted, finished or invalid game.");

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

    return { initializeGame, finishGame, setInvalidState, togglePause, calculateTime };
}
