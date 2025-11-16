import clsx from "clsx";
import { type ComponentType, useContext } from "react";
import type { GameOptions } from "src/gameOptions";
import { type GameProps, GameStoreContext, Sidebar, SidebarContent } from "../common";

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
        <div className={clsx("size-full flex gap-[16px] sm:px-[20px] min-h-[600px]",
            (fullscreen) ? "py-[20px]" : "lg:px-[100px] sm:pb-[38px]")}>
            <div className="relative flex-1 sm:rounded-[20px] overflow-hidden">
                <GameScreen onRestart={onRestart}/>
            </div>

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
        </div>
    );
}
