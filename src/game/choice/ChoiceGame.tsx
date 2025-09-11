import { useContext } from "react";
import { useNavigate } from "react-router";
import { encodeGameURL, type GameOptions } from "src/gameOptions";
import { GameLayout, PausedView, Sidebar, SidebarContent } from "../common";
import { ChoiceGameStoreContext } from "./storeContext";
import { FinishedView, View } from "./ui";

export function ChoiceGame() {
    const useChoiceGameStore = useContext(ChoiceGameStoreContext);

    const togglePause = useChoiceGameStore((game) => game.togglePause);
    const calculateTime = useChoiceGameStore((game) => game.calculateTime);

    const gameState = useChoiceGameStore((game) => game.state);
    const options = useChoiceGameStore((game) => game.options);

    // Whether or not the user should confirm game restarts.
    const restartNeedsConfirmation = useChoiceGameStore((game) => game.current > 0);

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

