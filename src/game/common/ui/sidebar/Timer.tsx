import clsx from "clsx";
import { useEffect, useState } from "react";
import { ClockIcon } from "src/ui";
import { toMinutesAndSeconds } from "src/utils/time";
import type { GameState } from "../../state";

export interface TimerProps {
    gameState: GameState;
    calculateTime: () => number;
}

export function Timer({ gameState, calculateTime }: TimerProps) {
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
        <div className={clsx("flex items-center gap-[7px]", gameState === "paused" && "animate-blink")}>
            <ClockIcon/>
            <span className="mt-[1px]">
                {minutes}
                :
                {seconds.toString().padStart(2, "0")}
            </span>
        </div>
    )
}
