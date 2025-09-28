import { useContext } from "react";
import { PausedView, Sidebar, SidebarContent, type GameProps } from "../common";
import { TypingGameStoreContext } from "./storeContext";
import { FinishedView, View } from "./ui";

export function TypingGame({ onRestart, onOptionsChange, fullscreen, onToggleFullscreen }: GameProps) {
    const useTypingGameStore = useContext(TypingGameStoreContext);

    const togglePause = useTypingGameStore((game) => game.togglePause);
    const calculateTime = useTypingGameStore((game) => game.calculateTime);

    const gameState = useTypingGameStore((game) => game.state);
    const options = useTypingGameStore((game) => game.options);

    // Check whether or not the user should confirm game restarts.
    const restartNeedsConfirmation = () => {
        const game = useTypingGameStore.getState();
        return game.state !== "finished" && game.answered > 0;
    };

    const handleTogglePause = () => {
        if (gameState !== "finished") {
            togglePause();
        }
    };

    return (<>
        {(gameState === "paused") ? (
            <PausedView onUnpauseClick={togglePause}/>
        ) : (gameState === "finished") ? (
            <FinishedView onRestart={onRestart}/>
        ) : (
            <View/>
        )}

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
    </>);
}
