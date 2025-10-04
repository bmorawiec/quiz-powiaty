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
import { DnDGameStoreContext } from "./storeContext";
import { FinishedView, View } from "./ui";
import { UnusedCardList } from "./ui/UnusedCardList";

export function DnDGame({ onRestart, onOptionsChange, fullscreen, onToggleFullscreen }: GameProps) {
    const useDnDGameStore = useContext(DnDGameStoreContext);

    const togglePause = useDnDGameStore((game) => game.togglePause);
    const calculateTime = useDnDGameStore((game) => game.calculateTime);

    const gameState = useDnDGameStore((game) => game.state);
    const options = useDnDGameStore((game) => game.options);

    // Check whether or not the user should confirm game restarts.
    const restartNeedsConfirmation = () => {
        const game = useDnDGameStore.getState();
        return game.state !== "finished" && game.unusedCardIds.length !== game.answerIds.length;
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
                >
                    <UnusedCardList/>
                </SidebarContent>
            </Sidebar>
        </GameLayout>
    );
}
