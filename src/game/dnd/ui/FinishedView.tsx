import { useContext } from "react";
import { FinishedViewBase } from "../../common";
import { DnDGameStoreContext } from "../storeContext";

export interface FinishedViewProps {
    onRestart: () => void;
}

export function FinishedView({ onRestart }: FinishedViewProps) {
    const useDnDGameStore = useContext(DnDGameStoreContext);
    const options = useDnDGameStore((game) => game.options);

    const questions = useDnDGameStore((game) => game.questions);
    const questionIds = useDnDGameStore((game) => game.questionIds);
    const allAnswers = useDnDGameStore((game) => game.answers);

    return (
        <FinishedViewBase
            options={options}
            questions={questions}
            questionIds={questionIds}
            allAnswers={allAnswers}
            onRestart={onRestart}
        />
    );
}
