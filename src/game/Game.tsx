import { lazy } from "react";
import type { GameProps } from "src/game/common";

const ChoiceGame = lazy(() => import("src/game/choice"));
const PromptGame = lazy(() => import("src/game/prompt"));

export function Game({ options }: GameProps) {
    if (options.gameType === "choiceGame") {
        return <ChoiceGame options={options}/>
    } else if (options.gameType === "promptGame") {
        return <PromptGame options={options}/>
    }
    return null;
}
