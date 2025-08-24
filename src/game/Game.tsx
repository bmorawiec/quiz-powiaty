import { lazy } from "react";
import type { GameProps } from "./common";

const ChoiceGame = lazy(() => import("./choice"));
const PromptGame = lazy(() => import("./prompt"));

export function Game({ options }: GameProps) {
    if (options.gameType === "choiceGame") {
        return <ChoiceGame options={options}/>
    } else if (options.gameType === "promptGame") {
        return <PromptGame options={options}/>
    }
    return null;
}
