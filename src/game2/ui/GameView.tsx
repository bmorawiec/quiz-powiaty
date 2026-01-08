import type { ComponentType } from "react";
import { Sidebar } from "./sidebar";

export interface GameViewProps {
    gameComponent: ComponentType;
}

export function GameView({ gameComponent }: GameViewProps) {
    const GameComponent = gameComponent;
    return (
        <div className="size-full relative flex gap-[16px]">
            <div className="flex-1 overflow-hidden">
                <GameComponent/>
            </div>

            <Sidebar/>
        </div>
    );
}
