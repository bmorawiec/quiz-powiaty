import clsx from "clsx";
import { useEffect, useState } from "react";
import { ClockIcon } from "src/ui";
import { toMinutesAndSeconds } from "src/utils/time";

export interface TimerProps {
    paused: boolean;
    calculateTime: () => number;
}

export function Timer({ paused, calculateTime }: TimerProps) {
    const [time, setTime] = useState(calculateTime());
    const [minutes, seconds] = toMinutesAndSeconds(time);

    useEffect(() => {
        const interval = setInterval(() => {
            setTime(calculateTime());
        }, 1000);
        return () => clearInterval(interval);
    }, []);

    return (
        <div className={clsx("flex items-center gap-[7px]", paused && "animate-blink")}>
            <ClockIcon/>
            <span className="mt-[1px]">
                {minutes}
                :
                {seconds.toString().padStart(2, "0")}
            </span>
        </div>
    )
}
