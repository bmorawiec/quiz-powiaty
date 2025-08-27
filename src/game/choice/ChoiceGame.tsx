import { useEffect } from "react";
import { useNavigate } from "react-router";
import { encodeGameURL, type GameOptions } from "src/gameOptions";
import { useBreakpoints } from "src/ui";
import { GameLayout, PausedView, Sidebar, type GameProps } from "../common";
import { calculateTime, gameFromOptions, togglePause, useQuestionGameStore } from "./state";
import { View } from "./View";

export function ChoiceGame({ options }: GameProps) {
    const navigate = useNavigate();
    const layout = useBreakpoints();

    useEffect(() => {
        gameFromOptions(options);
    }, [options]);

    // Whether or not the user should confirm game restarts.
    const restartNeedsConfirmation = useQuestionGameStore((game) => game.current > 0);

    const gameState = useQuestionGameStore((game) => game.state);
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

