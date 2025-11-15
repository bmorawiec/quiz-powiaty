import type { Context } from "react";
import { GameStoreContext } from "../common";
import type { ChoiceGameStoreHook } from "./state";

export const ChoiceGameStoreContext = GameStoreContext as unknown as Context<ChoiceGameStoreHook>;
