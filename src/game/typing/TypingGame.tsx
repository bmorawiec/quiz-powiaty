import { useLayoutEffect } from "react";
import { useNavigate } from "react-router";
import { encodeGameURL, type GameOptions } from "src/gameOptions";
import { GameLayout, PausedView, Sidebar, SidebarContent, type GameProps } from "../common";
import { calculateTime, gameFromOptions, resetGame, togglePause, useTypingGameStore } from "./state";
import { FinishedView, View } from "./ui";

export function TypingGame({ options }: GameProps) {
    const navigate = useNavigate();

    useLayoutEffect(() => {
        gameFromOptions(options);
        return () => {
            resetGame();
        };
    }, [options]);

    // Whether or not the user should confirm game restarts.
    const restartNeedsConfirmation = useTypingGameStore((game) => game.answered > 0);

    const gameState = useTypingGameStore((game) => game.state);
    if (gameState === "unstarted" || gameState === "starting") {
        return null;
    }

    const handleTogglePause = () => {
        if (gameState !== "finished") {
            togglePause();
        }
    };

    const handleGameRestart = (newOptions?: GameOptions) => {
        const newURL = encodeGameURL(newOptions || options);
        navigate(newURL);
    };

    return (
        <GameLayout>
            {(gameState === "paused") ? (
                <PausedView onUnpauseClick={togglePause}/>
            ) : (gameState === "finished") ? (
                <FinishedView
                    options={options}
                    onRestart={handleGameRestart}
                />
            ) : (
                <View options={options}/>
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
