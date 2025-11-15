import { useContext } from "react";
import { type GameProps } from "../common";
import { PromptGameStoreContext } from "./storeContext";
import { FinishedView, View } from "./ui";

export function PromptGame({ onRestart }: GameProps) {
    const usePromptGameStore = useContext(PromptGameStoreContext);
    const gameState = usePromptGameStore((game) => game.state);

    if (gameState === "finished") {
        return <FinishedView onRestart={onRestart}/>;
    } else {
        return <View/>;
    }
}
