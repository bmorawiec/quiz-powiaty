import { useEffect } from "react";
import { useNavigate } from "react-router";
import { encodeGameURL, type GameOptions } from "src/gameOptions";
import { useBreakpoints } from "src/ui";
import { GameLayout, type GameProps, PausedView, Sidebar } from "../common";
import { View } from "./View";
import { calculateTime, gameFromOptions, togglePause, usePromptGameStore } from "./state";

export function PromptGame({ options }: GameProps) {
    const navigate = useNavigate();
    const layout = useBreakpoints();

    useEffect(() => {
        gameFromOptions(options);
    }, [options]);

    // Whether or not the user should confirm game restarts.
    const restartNeedsConfirmation = usePromptGameStore((game) => game.current > 0);

    const gameState = usePromptGameStore((game) => game.state);
    if (gameState === "unstarted" || gameState === "invalid" || gameState === "finished") {
        return null;
    }

    const handleGameRestart = (newOptions: GameOptions) => {
        const newURL = encodeGameURL(newOptions);
        navigate(newURL);
    };

    return (
        <GameLayout>
            {(gameState === "paused") ? (
                <PausedView onUnpauseClick={togglePause}/>
            ) : (
                <View options={options}/>
            )}

            {(layout === "md" || layout === "lg" || layout === "xl") && (
                <Sidebar
                    paused={gameState === "paused"}
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
