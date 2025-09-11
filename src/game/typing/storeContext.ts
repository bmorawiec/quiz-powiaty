import { createContext } from "react";
import type { TypingGameStoreHook } from "./state";

export const TypingGameStoreContext = createContext<TypingGameStoreHook>(null as unknown as TypingGameStoreHook);
