import { useMemo } from "react";
import type { GameOptions } from "src/gameOptions";
import { FinishedViewBase } from "../../common";
import { calculateTime, useTypingGameStore } from "../state";

export interface FinishedViewProps {
    options: GameOptions;
    onRestart: () => void;
}

export function FinishedView({ options, onRestart }: FinishedViewProps) {
    const questions = useTypingGameStore((state) => state.questions);
    const time = useMemo(() => calculateTime(), []);

    return (
        <FinishedViewBase
            options={options}
            questions={questions}
            time={time}
            onRestart={onRestart}
        />
    );
}
