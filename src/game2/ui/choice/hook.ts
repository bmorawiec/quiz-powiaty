import { createContext } from "react";
import type { ChoiceGameStore } from "src/game2/state";
import type { ZustandHook } from "src/utils/zustand";

/** Used to pass the useChoiceGameStore hook to ChoiceGame and components that are children of ChoiceGame. */
export const ChoiceGameStoreContext = createContext<ZustandHook<ChoiceGameStore>>(
    null as unknown as ZustandHook<ChoiceGameStore>
);
