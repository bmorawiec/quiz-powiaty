import { createContext } from "react";
import type { GameStoreHook } from "./state";

export const GameStoreContext = createContext<GameStoreHook>(null as unknown as GameStoreHook);
