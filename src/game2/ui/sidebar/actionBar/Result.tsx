import { useContext } from "react";
import { GameStoreContext } from "../../hook";
import { StatsIcon } from "src/ui";

export function Result() {
    const useGameStore = useContext(GameStoreContext);

    const points = useGameStore((game) => game.api.points);
    const maxPoints = useGameStore((game) => game.api.maxPoints);

    const percent = Math.floor(points / maxPoints * 100);

    return (
        <div className="flex items-center gap-[6px]">
            <StatsIcon className="size-[14px]"/>
            {points}/{maxPoints}pkt ({percent}%)
        </div>
    );
}
