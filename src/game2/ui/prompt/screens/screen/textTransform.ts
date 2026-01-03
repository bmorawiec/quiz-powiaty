import type { GameAPIOptions } from "src/game2/api";

/** Determines how answers should be capitalized depending on what is being guessed. */
export function getTextTransform(apiOptions: GameAPIOptions): "uppercase" | "capitalize" | undefined {
    if (apiOptions.guess === "capital") {
        return "capitalize";
    } else if (apiOptions.guess === "plate") {
        return "uppercase";
    }
}
