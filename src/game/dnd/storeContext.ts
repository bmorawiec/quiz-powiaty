import type { Context } from "react";
import { GameStoreContext } from "../common";
import type { DnDGameStoreHook } from "./state";

export const DnDGameStoreContext = GameStoreContext as unknown as Context<DnDGameStoreHook>;
