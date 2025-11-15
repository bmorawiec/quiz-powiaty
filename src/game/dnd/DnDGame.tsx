import { useContext } from "react";
import { type GameProps } from "../common";
import { DnDGameStoreContext } from "./storeContext";
import { FinishedView, View } from "./ui";

export function DnDGame({ onRestart }: GameProps) {
    const useDnDGameStore = useContext(DnDGameStoreContext);
    const gameState = useDnDGameStore((game) => game.state);

    if (gameState === "finished") {
        return <FinishedView onRestart={onRestart}/>;
    } else {
        return <View/>;
    }
}
