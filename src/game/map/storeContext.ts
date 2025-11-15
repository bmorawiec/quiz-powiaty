import type { Context } from "react";
import { GameStoreContext } from "../common";
import type { MapGameStoreHook } from "./state";

export const MapGameStoreContext = GameStoreContext as unknown as Context<MapGameStoreHook>;

