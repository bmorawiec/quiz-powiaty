import type { GameOptions } from "src/gameOptions";
import { FinishedViewBase } from "../../common";
import { useChoiceGameStore } from "../state";

export interface FinishedViewProps {
    options: GameOptions;
    onRestart: () => void;
}

export function FinishedView({ options, onRestart }: FinishedViewProps) {
    const questions = useChoiceGameStore((state) => state.questions);

    return (
        <FinishedViewBase
            options={options}
            questions={questions}
            onRestart={onRestart}
        />
    );
}
