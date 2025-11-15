import { type Context } from "react";
import { GameStoreContext } from "../common";
import type { TypingGameStoreHook } from "./state";

export const TypingGameStoreContext = GameStoreContext as unknown as Context<TypingGameStoreHook>;
