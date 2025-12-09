import { createContext } from "react";
import type { GameStore } from "src/game2/state";
import type { ZustandHook } from "src/utils/zustand";

export const GameStoreContext = createContext<ZustandHook<GameStore>>(null as unknown as ZustandHook<GameStore>);
