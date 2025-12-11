import type { ComponentType } from "react";

export interface GameViewProps {
    gameComponent: ComponentType;
}

export function GameView({ gameComponent }: GameViewProps) {
    const GameComponent = gameComponent;
    return (
        <div className="size-full flex gap-[16px]">
            <div className="flex-1">
                <GameComponent/>
            </div>
            <div className="bg-white dark:bg-gray-95 w-[400px] rounded-[20px] shadow-sm shadow-black/10">
            </div>
        </div>
    );
}
