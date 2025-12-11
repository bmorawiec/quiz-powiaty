import { useCallback, useRef, useState, type ComponentType } from "react";
import { type GameStore } from "src/game2/state";
import { validateGameOptions, type GameOptions } from "src/gameOptions";
import type { ZustandHook } from "src/utils/zustand";
import { ulid } from "ulid";
import { createGame } from "./factory";

export interface GameSwitcherReturn extends GameSwitcherState {
    requestSwitch: (options: GameOptions | null) => void;
}

export interface GameSwitcherState {
    state: "waitingForRequest" | "switching" | "ready" | "invalidOptions";
    gameComponent: ComponentType | null;
    useGameStore: ZustandHook<GameStore> | null;
}

export function useGameSwitcher(): GameSwitcherReturn {
    const [state, setState] = useState<GameSwitcherState>({
        state: "waitingForRequest",
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

            const [gameComponent, useGameStore] = await createGame(options);
            if (newGameId.current === thisGameId) {
                setState({
                    state: "ready",
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
