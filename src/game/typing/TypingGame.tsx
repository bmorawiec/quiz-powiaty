import { useContext } from "react";
import { type GameProps } from "../common";
import { TypingGameStoreContext } from "./storeContext";
import { FinishedView, View } from "./ui";

export function TypingGame({ onRestart }: GameProps) {
    const useTypingGameStore = useContext(TypingGameStoreContext);
    const gameState = useTypingGameStore((game) => game.state);

    if (gameState === "finished") {
        return <FinishedView onRestart={onRestart}/>;
    } else {
        return <View/>;
    }
}
