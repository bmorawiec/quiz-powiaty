import { PauseIcon, PlayIcon } from "src/ui";
import { ControlButton } from "./ControlButton";
import { Timer } from "./Timer";

export interface ControlsProps {
    paused: boolean;
    calculateTime: () => number;
    onPauseClick?: () => void;
}

export function Controls({ paused, calculateTime, onPauseClick }: ControlsProps) {
    return (
        <div className="flex items-center h-[77px] px-[30px] border-bottom border-gray-30">
            <Timer
                paused={paused}
                calculateTime={calculateTime}
            />

            <ControlButton
                icon={(paused) ? PlayIcon : PauseIcon}
                className="ml-auto"
                onClick={onPauseClick}
            />
        </div>
    );
}
