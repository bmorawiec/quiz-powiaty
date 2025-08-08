import { useEffect } from "react";
import type { GameProps } from "../common";
import { Controls, GameLayout, Sidebar } from "../ui";
import { StandardView } from "./StandardView";
import { calculateTime, gameFromOptions, togglePause, usePromptGameStore } from "./state";

export function PromptGame({ options }: GameProps) {
    useEffect(() => {
        gameFromOptions(options);
    }, []);

    const gameState = usePromptGameStore((game) => game.state);
    if (gameState === "unstarted" || gameState === "invalid" || gameState === "finished") {
        return null;
    }

    const handlePauseClick = () => {
        togglePause();
    };

    return (
        <GameLayout>
            <StandardView options={options}/>
            <Sidebar>
                <Controls
                    paused={gameState === "paused"}
                    calculateTime={calculateTime}
                    onPauseClick={handlePauseClick}
                />
            </Sidebar>
        </GameLayout>
    );
}
