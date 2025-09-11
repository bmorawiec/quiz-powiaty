import { createContext } from "react";
import type { PromptGameStoreHook } from "./state";

export const PromptGameStoreContext = createContext<PromptGameStoreHook>(null as unknown as PromptGameStoreHook);
