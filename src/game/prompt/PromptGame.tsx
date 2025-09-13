import { useContext } from "react";
import { PausedView, Sidebar, SidebarContent, type GameProps } from "../common";
import { PromptGameStoreContext } from "./storeContext";
import { FinishedView, View } from "./ui";

export function PromptGame({ onRestart, onOptionsChange }: GameProps) {
    const usePromptGameStore = useContext(PromptGameStoreContext);

    const togglePause = usePromptGameStore((game) => game.togglePause);
    const calculateTime = usePromptGameStore((game) => game.calculateTime);

    const gameState = usePromptGameStore((game) => game.state);
    const options = usePromptGameStore((game) => game.options);

    // Check whether or not the user should confirm game restarts.
    const restartNeedsConfirmation = () => {
        const game = usePromptGameStore.getState();
        return game.current > 0;
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

        <Sidebar>
            <SidebarContent
                gameState={gameState}
                calculateTime={calculateTime}
                onTogglePause={handleTogglePause}
                options={options}
                restartNeedsConfirmation={restartNeedsConfirmation}
                onGameRestart={onRestart}
                onOptionsChange={onOptionsChange}
            />
        </Sidebar>
    </>);
}
