import type { ComponentType } from "react";

export interface GameViewProps {
    gameComponent: ComponentType;
}

export function GameView({ gameComponent }: GameViewProps) {
    const GameComponent = gameComponent;
    return (
        <GameComponent/>
    );
}
