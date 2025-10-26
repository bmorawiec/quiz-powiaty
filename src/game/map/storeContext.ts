import { createContext } from "react";
import type { MapGameStoreHook } from "./state";

export const MapGameStoreContext = createContext<MapGameStoreHook>(null as unknown as MapGameStoreHook);

