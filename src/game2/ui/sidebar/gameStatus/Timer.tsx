import clsx from "clsx";
import { useContext, useEffect, useState } from "react";
import { ClockIcon } from "src/ui";
import { toMinutesAndSeconds } from "src/utils/time";
import { GameStoreContext } from "../../hook";

export function Timer() {
    const useGameStore = useContext(GameStoreContext);

    const gameState = useGameStore((game) => game.api.state);
    const calculateTime = useGameStore((game) => game.api.calculateTime);

    const [time, setTime] = useState(calculateTime());
    const [minutes, seconds] = toMinutesAndSeconds(time);
    useEffect(() => {
        setTime(calculateTime());

        if (gameState === "unpaused") {
            const interval = setInterval(() => {
                setTime(calculateTime());
            }, 1000);
            return () => clearInterval(interval);
        }
    }, [gameState, calculateTime]);

    return (
        <div className={clsx("flex items-center gap-[6px]", gameState === "paused" && "animate-blink")}>
            <ClockIcon className="size-[14px]"/>
            {minutes}:{seconds.toString().padStart(2, "0")}
        </div>
    );
}
