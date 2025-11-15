import { useContext } from "react";
import { type GameProps } from "../common";
import { ChoiceGameStoreContext } from "./storeContext";
import { FinishedView, View } from "./ui";

export function ChoiceGame({ onRestart }: GameProps) {
    const useChoiceGameStore = useContext(ChoiceGameStoreContext);
    const gameState = useChoiceGameStore((game) => game.state);

    if (gameState === "finished") {
        return <FinishedView onRestart={onRestart}/>;
    } else {
        return <View/>;
    }
}

