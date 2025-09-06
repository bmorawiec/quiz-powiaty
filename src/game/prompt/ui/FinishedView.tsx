import type { GameOptions } from "src/gameOptions";
import { FinishedViewBase } from "../../common";
import { usePromptGameStore } from "../state";

export interface FinishedViewProps {
    options: GameOptions;
    onRestart: () => void;
}

export function FinishedView({ options, onRestart }: FinishedViewProps) {
    const prompts = usePromptGameStore((state) => state.prompts);

    return (
        <FinishedViewBase
            options={options}
            questions={prompts}
            onRestart={onRestart}
        />
    );
}
