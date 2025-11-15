import { type ComponentType, useContext } from "react";
import type { GameOptions } from "src/gameOptions";
import { GameLayout, type GameProps, GameStoreContext, Sidebar, SidebarContent, ViewContainer } from "../common";

export interface GameLayout2Props {
    gameScreen: ComponentType<GameProps>;
    onRestart: () => void;
    fullscreen: boolean;
    onToggleFullscreen: () => void;
    onOptionsChange: (newOptions: GameOptions) => void;
}

export function GameLayout2({
    gameScreen,
    onRestart,
    fullscreen,
    onToggleFullscreen,
    onOptionsChange,
}: GameLayout2Props) {
    const useGameStore = useContext(GameStoreContext);
    const options = useGameStore((game) => game.options);
    const gameState = useGameStore((game) => game.state);
    const calculateTime = useGameStore((game) => game.calculateTime);
    const togglePause = useGameStore((game) => game.togglePause);

    const restartNeedsConfirmation = () => {
        const game = useGameStore.getState();
        return game.answered > 0;
    };

    const GameScreen = gameScreen;
    return (
        <GameLayout fullscreen={fullscreen}>
            <ViewContainer>
                <GameScreen onRestart={onRestart}/>
            </ViewContainer>

            <Sidebar
                gameState={gameState}
            >
                <SidebarContent
                    gameState={gameState}
                    calculateTime={calculateTime}
                    onTogglePause={togglePause}
                    fullscreen={fullscreen}
                    onToggleFullscreen={onToggleFullscreen}
                    options={options}
                    restartNeedsConfirmation={restartNeedsConfirmation}
                    onGameRestart={onRestart}
                    onOptionsChange={onOptionsChange}
                />
            </Sidebar>
        </GameLayout>
    );
}
