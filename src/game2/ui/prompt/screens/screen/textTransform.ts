import type { GameAPIOptions } from "src/game2/api";

/** Determines how answers should be capitalized depending on what is being guessed. */
export function getTextTransform(_apiOptions: GameAPIOptions): "uppercase" | "capitalize" | undefined {
    return undefined;
}
