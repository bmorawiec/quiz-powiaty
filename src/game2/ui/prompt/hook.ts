import { createContext } from "react";
import type { PromptGameStore } from "src/game2/state";
import type { ZustandHook } from "src/utils/zustand";

/** Used to pass the usePromptGameStore hook to PromptGame and components that are children of PromptGame. */
export const PromptGameStoreContext = 
    createContext<ZustandHook<PromptGameStore>>(null as unknown as ZustandHook<PromptGameStore>);
