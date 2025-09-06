import type { GameOptions } from "src/gameOptions";
import { FinishedViewBase } from "../../common";
import { useTypingGameStore } from "../state";

export interface FinishedViewProps {
    options: GameOptions;
    onRestart: () => void;
}

export function FinishedView({ options, onRestart }: FinishedViewProps) {
    const questions = useTypingGameStore((state) => state.questions);

    return (
        <FinishedViewBase
            options={options}
            questions={questions}
            onRestart={onRestart}
        />
    );
}
