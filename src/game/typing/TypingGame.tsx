import { useContext } from "react";
import { useNavigate } from "react-router";
import { encodeGameURL, type GameOptions } from "src/gameOptions";
import { GameLayout, PausedView, Sidebar, SidebarContent } from "../common";
import { TypingGameStoreContext } from "./storeContext";
import { FinishedView, View } from "./ui";

export function TypingGame() {
    const useTypingGameStore = useContext(TypingGameStoreContext);

    const togglePause = useTypingGameStore((game) => game.togglePause);
    const calculateTime = useTypingGameStore((game) => game.calculateTime);

    const gameState = useTypingGameStore((game) => game.state);
    const options = useTypingGameStore((game) => game.options);

    // Whether or not the user should confirm game restarts.
    const restartNeedsConfirmation = useTypingGameStore((game) => game.answered > 0);

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
