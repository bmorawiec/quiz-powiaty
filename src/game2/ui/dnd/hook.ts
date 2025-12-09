import { createContext } from "react";
import type { DnDGameStore } from "src/game2/state";
import type { ZustandHook } from "src/utils/zustand";

export const DnDGameStoreContext = createContext<ZustandHook<DnDGameStore>>(
    null as unknown as ZustandHook<DnDGameStore>
);
