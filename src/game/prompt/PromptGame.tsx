import { useContext } from "react";
import { useNavigate } from "react-router";
import { encodeGameURL, type GameOptions } from "src/gameOptions";
import { GameLayout, PausedView, Sidebar, SidebarContent } from "../common";
import { PromptGameStoreContext } from "./storeContext";
import { FinishedView, View } from "./ui";

export function PromptGame() {
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

    const navigate = useNavigate();
    const handleGameRestart = (newOptions?: GameOptions) => {
        const newURL = encodeGameURL(newOptions || options);
        navigate(newURL);
    };

    return (
        <GameLayout>
            {(gameState === "paused") ? (
                <PausedView onUnpauseClick={togglePause}/>
            ) : (gameState === "finished") ? (
                <FinishedView onRestart={handleGameRestart}/>
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
                    onGameRestart={handleGameRestart}
                />
            </Sidebar>
        </GameLayout>
    );
}
