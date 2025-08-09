import { useEffect } from "react";
import { useNavigate } from "react-router";
import { encodeGameURL } from "src/url";
import type { GameOptions, GameProps } from "../common";
import { Controls, GameLayout, OptionsPanel, Sidebar } from "../ui";
import { StandardView } from "./StandardView";
import { calculateTime, gameFromOptions, togglePause, usePromptGameStore } from "./state";

export function PromptGame({ options }: GameProps) {
    const navigate = useNavigate();

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

    const handleOptionsChange = (newOptions: GameOptions) => {
        const newURL = encodeGameURL(newOptions);
        navigate(newURL);
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
                <OptionsPanel
                    options={options}
                    onChange={handleOptionsChange}
                />
            </Sidebar>
        </GameLayout>
    );
}
