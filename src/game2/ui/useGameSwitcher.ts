import { useCallback, useRef, useState, type ComponentType } from "react";
import { type GameStore } from "src/game2/state";
import { validateGameOptions, type GameOptions } from "src/gameOptions";
import type { ZustandHook } from "src/utils/zustand";
import { ulid } from "ulid";
import { createGame } from "./factory";

export interface GameSwitcherReturn extends GameSwitcherState {
    /** Changes game options or begins the first game.
     *  The game with the specified options will be prepared in the background and will then replace
     *  the current one. */
    requestSwitch: (options: GameOptions | null) => void;
}

export interface GameSwitcherState {
    /** "uninitialized" - Waiting for the first `requestSwitch` call. No game is currently running.
     *  "switching" - A game switch is currently underway.
     *  "ready" - The old game has been replaced with the new one.
     *  "invalidOptions" - The options provided in the last `requestSwitch` call were invalid or missing. */
    state: "uninitialized" | "switching" | "ready" | "invalidOptions";
    /** If true, then this is the first time a game is being started */
    firstLoad: boolean;
    /** Game component of the current game.
     *  Null if switcher is uninitialized. */
    gameComponent: ComponentType | null;
    /** Game store of the current game.
     *  Null if switcher is uninitialized. */
    useGameStore: ZustandHook<GameStore> | null;
}

/** Allows a game to be running while the next one is being prepared. */
export function useGameSwitcher(): GameSwitcherReturn {
    const [state, setState] = useState<GameSwitcherState>({
        state: "uninitialized",
        firstLoad: true,
        gameComponent: null,
        useGameStore: null,
    });

    const newGameId = useRef<string | null>(null);

    const requestSwitch = useCallback(async (options: GameOptions | null) => {
        if (options && validateGameOptions(options)) {
            setState((state) => ({
                ...state,
                state: "switching",
            }));

            const thisGameId = ulid();
            newGameId.current = thisGameId;

            const handleRestart = () => {
                requestSwitch(options);
            };
            const [gameComponent, useGameStore] = await createGame(options, handleRestart);
            if (newGameId.current === thisGameId) {
                setState({
                    state: "ready",
                    firstLoad: false,
                    gameComponent,
                    useGameStore,
                });
            }
        } else {
            setState((state) => ({
                ...state,
                state: "invalidOptions",
            }));
        }
    }, []);

    return {
        ...state,
        requestSwitch,
    };
}
