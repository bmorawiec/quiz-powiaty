import type { ComponentType } from "react";
import type { GameOptions } from "src/gameOptions";
import type { ZustandHook } from "src/utils/zustand";
import type { GameStore } from "src/game2/state";
import type { GameAPICallbacks } from "../api";

/** Creates a game store and component of the correct type, depending on the game options. */
export async function createGame(
    options: GameOptions,
    callbacks: GameAPICallbacks,
): Promise<[ComponentType, ZustandHook<GameStore>]> {
    if (options.gameType === "choiceGame") {
        const { createChoiceGame } = await import("./choice");
        return createChoiceGame(options, callbacks);
    } else if (options.gameType === "dndGame") {
        const { createDnDGame } = await import("./dnd");
        return createDnDGame(options, callbacks);
    } else if (options.gameType === "promptGame") {
        const { createPromptGame } = await import("./prompt");
        return createPromptGame(options, callbacks);
    }
    throw new Error("Unknown game type: " + options.gameType);
}
