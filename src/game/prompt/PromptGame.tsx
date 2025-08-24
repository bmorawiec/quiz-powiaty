import { useEffect } from "react";
import { useNavigate } from "react-router";
import { encodeGameURL, type GameOptions } from "src/gameOptions";
import { useBreakpoints } from "src/ui";
import { Controls, GameLayout, type GameProps, OptionsPanel, PausedView, Sidebar } from "../common";
import { View } from "./View";
import { calculateTime, gameFromOptions, togglePause, usePromptGameStore } from "./state";

export function PromptGame({ options }: GameProps) {
    const navigate = useNavigate();
    const layout = useBreakpoints();

    useEffect(() => {
        gameFromOptions(options);
    }, [options]);

    const gameState = usePromptGameStore((game) => game.state);
    if (gameState === "unstarted" || gameState === "invalid" || gameState === "finished") {
        return null;
    }

    const handleOptionsChange = (newOptions: GameOptions) => {
        const newURL = encodeGameURL(newOptions);
        navigate(newURL);
    };

    const paused = gameState === "paused";

    return (
        <GameLayout>
            {(paused) ? (
                <PausedView onUnpauseClick={togglePause}/>
            ) : (
                <View options={options}/>
            )}
            {(layout === "md" || layout === "lg" || layout === "xl") && (
                <Sidebar>
                    <Controls
                        paused={paused}
                        calculateTime={calculateTime}
                        onPauseClick={togglePause}
                    />
                    <OptionsPanel
                        options={options}
                        onChange={handleOptionsChange}
                    />
                </Sidebar>
            )}
        </GameLayout>
    );
}
