import { createContext } from "react";
import type { ChoiceGameStoreHook } from "./state";

export const ChoiceGameStoreContext = createContext<ChoiceGameStoreHook>(null as unknown as ChoiceGameStoreHook);
