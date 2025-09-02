import { useEffect } from "react";
import { useNavigate } from "react-router";
import { encodeGameURL, type GameOptions } from "src/gameOptions";
import { useBreakpoints } from "src/ui";
import { GameLayout, PausedView, Sidebar, type GameProps } from "../../common";
import { FinishedView } from "./FinishedView";
import { calculateTime, gameFromOptions, togglePause, useChoiceGameStore } from "../state";
import { View } from "./View";

export function ChoiceGame({ options }: GameProps) {
    const navigate = useNavigate();
    const layout = useBreakpoints();

    useEffect(() => {
        gameFromOptions(options);
    }, [options]);

    // Whether or not the user should confirm game restarts.
    const restartNeedsConfirmation = useChoiceGameStore((game) => game.current > 0);

    const gameState = useChoiceGameStore((game) => game.state);
    if (gameState === "unstarted" || gameState === "invalid") {
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

