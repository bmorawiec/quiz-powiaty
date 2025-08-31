import { useEffect } from "react";
import { useNavigate } from "react-router";
import { encodeGameURL, type GameOptions } from "src/gameOptions";
import { useBreakpoints } from "src/ui";
import { GameLayout, type GameProps, PausedView, Sidebar } from "../common";
import { FinishedView } from "./finishedView";
import { calculateTime, gameFromOptions, togglePause, usePromptGameStore } from "./state";
import { View } from "./View";

export function PromptGame({ options }: GameProps) {
    const navigate = useNavigate();
    const layout = useBreakpoints();

    useEffect(() => {
        gameFromOptions(options);
    }, [options]);

    // Whether or not the user should confirm game restarts.
    const restartNeedsConfirmation = usePromptGameStore((game) => game.current > 0);

    const gameState = usePromptGameStore((game) => game.state);
    if (gameState === "unstarted" || gameState === "invalid") {
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

            {(layout === "md" || layout === "lg" || layout === "xl") && (
                <Sidebar
                    gameState={gameState}
                    calculateTime={calculateTime}
                    onTogglePause={handleTogglePause}
                    options={options}
                    restartNeedsConfirmation={restartNeedsConfirmation}
                    onGameRestart={handleGameRestart}
                />
            )}
        </GameLayout>
    );
}
