import { useContext } from "react";
import {
    GameLayout,
    LoadingPopup,
    PausedView,
    Sidebar,
    SidebarContent,
    ViewContainer,
    type GameProps,
} from "../common";
import { MapGameStoreContext } from "./storeContext";
import { FinishedView, View } from "./ui";

export function MapGame({ onRestart, onOptionsChange, fullscreen, onToggleFullscreen, isLoading }: GameProps) {
    const useMapGameStore = useContext(MapGameStoreContext);

    const togglePause = useMapGameStore((game) => game.togglePause);
    const calculateTime = useMapGameStore((game) => game.calculateTime);

    const gameState = useMapGameStore((game) => game.state);
    const options = useMapGameStore((game) => game.options);

    // Check whether or not the user should confirm game restarts.
    const restartNeedsConfirmation = () => {
        const game = useMapGameStore.getState();
        return game.state !== "finished" && game.answered > 0;
    };

    const handleTogglePause = () => {
        if (gameState !== "finished") {
            togglePause();
        }
    };

    return (
        <GameLayout fullscreen={fullscreen}>
            <ViewContainer>
                {(gameState === "paused") ? (
                    <PausedView/>
                ) : (gameState === "finished") ? (
                    <FinishedView onRestart={onRestart}/>
                ) : (
                    <View/>
                )}

                {isLoading && <LoadingPopup/>}
            </ViewContainer>

            <Sidebar gameState={gameState}>
                <SidebarContent
                    gameState={gameState}
                    calculateTime={calculateTime}
                    onTogglePause={handleTogglePause}
                    fullscreen={fullscreen}
                    onToggleFullscreen={onToggleFullscreen}
                    options={options}
                    restartNeedsConfirmation={restartNeedsConfirmation}
                    onGameRestart={onRestart}
                    onOptionsChange={onOptionsChange}
                />
            </Sidebar>
        </GameLayout>
    );
}
