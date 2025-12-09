import { createContext } from "react";
import type { ChoiceGameStore } from "src/game2/state";
import type { ZustandHook } from "src/utils/zustand";

export const ChoiceGameStoreContext = createContext<ZustandHook<ChoiceGameStore>>(
    null as unknown as ZustandHook<ChoiceGameStore>
);
