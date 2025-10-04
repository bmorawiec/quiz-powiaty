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
import { ChoiceGameStoreContext } from "./storeContext";
import { FinishedView, View } from "./ui";

export function ChoiceGame({ onRestart, onOptionsChange, fullscreen, onToggleFullscreen, isLoading }: GameProps) {
    const useChoiceGameStore = useContext(ChoiceGameStoreContext);

    const togglePause = useChoiceGameStore((game) => game.togglePause);
    const calculateTime = useChoiceGameStore((game) => game.calculateTime);

    const gameState = useChoiceGameStore((game) => game.state);
    const options = useChoiceGameStore((game) => game.options);

    // Check whether or not the user should confirm game restarts.
    const restartNeedsConfirmation = () => {
        const game = useChoiceGameStore.getState();
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
                    <PausedView onUnpauseClick={togglePause}/>
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

