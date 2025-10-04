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
import { PromptGameStoreContext } from "./storeContext";
import { FinishedView, View } from "./ui";

export function PromptGame({ onRestart, onOptionsChange, fullscreen, onToggleFullscreen }: GameProps) {
    const usePromptGameStore = useContext(PromptGameStoreContext);

    const togglePause = usePromptGameStore((game) => game.togglePause);
    const calculateTime = usePromptGameStore((game) => game.calculateTime);

    const gameState = usePromptGameStore((game) => game.state);
    const options = usePromptGameStore((game) => game.options);

    // Check whether or not the user should confirm game restarts.
    const restartNeedsConfirmation = () => {
        const game = usePromptGameStore.getState();
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
