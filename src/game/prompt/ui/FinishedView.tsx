import { useMemo } from "react";
import type { GameOptions } from "src/gameOptions";
import { FinishedViewBase } from "../../common";
import { calculateTime, usePromptGameStore } from "../state";

export interface FinishedViewProps {
    options: GameOptions;
    onRestart: () => void;
}

export function FinishedView({ options, onRestart }: FinishedViewProps) {
    const prompts = usePromptGameStore((state) => state.prompts);
    const time = useMemo(() => calculateTime(), []);

    return (
        <FinishedViewBase
            options={options}
            questions={prompts}
            time={time}
            onRestart={onRestart}
        />
    );
}
