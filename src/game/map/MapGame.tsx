import { useContext } from "react";
import { type GameProps } from "../common";
import { MapGameStoreContext } from "./storeContext";
import { FinishedView, View } from "./ui";

export function MapGame({ onRestart }: GameProps) {
    const useMapGameStore = useContext(MapGameStoreContext);
    const gameState = useMapGameStore((game) => game.state);

    if (gameState === "finished") {
        return <FinishedView onRestart={onRestart}/>;
    } else {
        return <View/>;
    }
}
