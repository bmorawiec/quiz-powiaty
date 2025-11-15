import { type Context } from "react";
import { GameStoreContext } from "../common";
import type { PromptGameStoreHook } from "./state";

export const PromptGameStoreContext = GameStoreContext as unknown as Context<PromptGameStoreHook>;
