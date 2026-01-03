import type { ComponentType } from "react";
import type { GameOptions } from "src/gameOptions";
import type { ZustandHook } from "src/utils/zustand";
import type { GameStore } from "src/game2/state";

/** Creates a game store and component of the correct type, depending on the game options. */
export async function createGame(options: GameOptions): Promise<[ComponentType, ZustandHook<GameStore>]> {
    if (options.gameType === "choiceGame") {
        const { createChoiceGame } = await import("./choice");
        return createChoiceGame(options);
    } else if (options.gameType === "dndGame") {
        const { createChoiceGame } = await import("./choice");
        return createChoiceGame(options);
    } else if (options.gameType === "promptGame") {
        const { createPromptGame } = await import("./prompt");
        return createPromptGame(options);
    }
    throw new Error("Unknown game type: " + options.gameType);
}
