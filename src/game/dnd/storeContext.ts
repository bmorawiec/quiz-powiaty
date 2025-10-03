import { createContext } from "react";
import type { DnDGameStoreHook } from "./state";

export const DnDGameStoreContext = createContext<DnDGameStoreHook>(null as unknown as DnDGameStoreHook);
