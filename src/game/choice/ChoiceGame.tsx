import { useLayoutEffect } from "react";
import { useNavigate } from "react-router";
import { encodeGameURL, type GameOptions } from "src/gameOptions";
import { useBreakpoints } from "src/ui";
import { GameLayout, PausedView, Sidebar, type GameProps } from "../common";
import { calculateTime, gameFromOptions, resetGame, togglePause, useChoiceGameStore } from "./state";
import { FinishedView, View } from "./ui";

export function ChoiceGame({ options }: GameProps) {
    const navigate = useNavigate();
    const layout = useBreakpoints();

    useLayoutEffect(() => {
        gameFromOptions(options);
        return () => {
            resetGame();
        };
    }, [options]);

    // Whether or not the user should confirm game restarts.
    const restartNeedsConfirmation = useChoiceGameStore((game) => game.current > 0);

    const gameState = useChoiceGameStore((game) => game.state);
    if (gameState === "unstarted") {
        return null;
    }

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
                <View/>
            )}

            {(layout === "md" || layout === "lg" || layout === "xl") && (
                <Sidebar
                    gameState={gameState}
                    calculateTime={calculateTime}
                    onTogglePause={togglePause}
                    options={options}
                    restartNeedsConfirmation={restartNeedsConfirmation}
                    onGameRestart={handleGameRestart}
                />
            )}
        </GameLayout>
    );
}

