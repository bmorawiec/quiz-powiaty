import { type GameOptions } from "src/gameOptions";
import type { StoreApi, UseBoundStore } from "zustand";
import type { GameStore } from "./types";

export function createActions(hook: UseBoundStore<StoreApi<GameStore>>) {
    /** Sets game options.
     *  Assumes that the game options have already been validated.
     *  @throws if the game has been started. */
    function setOptions(options: GameOptions) {
        const game = hook.getState();
        if (game.state !== "unstarted")
            throw new Error("This action may only be performed when the game is unstarted.");

        hook.setState({
            options,
        });
    }

    /** Used to unpause the game for the first time.
     *  @throws if the game has been started. */
    function startGame() {
        const game = hook.getState();
        if (game.state !== "unstarted")
            throw new Error("This action may only be performed when the game is unstarted.");

        hook.setState({
            state: "unpaused",
            timestamps: [Date.now()],
        });
    }

    /** Resets the game to the "unstarted" state. */
    function resetGame() {
        hook.setState({
            state: "unstarted",
            timestamps: [],
        });
    }

    /** Sets the state of the game to "finished".
     *  @throws if the game hasn't been started or if it has finished. */
    function finishGame() {
        const game = hook.getState();
        if (game.state === "unstarted" || game.state === "finished")
            throw new Error("This action may only be performed after the game is started and before it is finished.");

        hook.setState({
            state: "finished",
            timestamps: [...game.timestamps, Date.now()],
        });
    }

    /** Pauses the game if it's currently unpaused. Unpauses the game if it's currently paused.
      * @throws if the game hasn't been started yet or if it has finished. */
    function togglePause() {
        const game = hook.getState();
        if (game.state === "unstarted" || game.state === "finished")
            throw new Error("Cannot pause or unpause an unstarted or finished game.");

        const newState = (game.state === "paused") ? "unpaused" : "paused";
        const timestamp = Date.now();
        hook.setState({
            state: newState,
            timestamps: [...game.timestamps, timestamp],
        });
    }

    /** Calculates the time the game has been running for unpaused.
      * @throws if the game hasn't been started yet. */
    function calculateTime(): number {
        const game = hook.getState();
        if (game.state === "unstarted")
            throw new Error("Cannot calculate the time for an unstarted game.");

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

    return { setOptions, startGame, resetGame, finishGame, togglePause, calculateTime };
}
