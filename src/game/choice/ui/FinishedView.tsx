import { useContext } from "react";
import { FinishedViewBase } from "../../common";
import { ChoiceGameStoreContext } from "../storeContext";

export interface FinishedViewProps {
    onRestart: () => void;
}

export function FinishedView({ onRestart }: FinishedViewProps) {
    const useChoiceGameStore = useContext(ChoiceGameStoreContext);
    const options = useChoiceGameStore((game) => game.options);

    const questions = useChoiceGameStore((game) => game.questions);
    const questionIds = useChoiceGameStore((game) => game.questionIds);
    const allAnswers = useChoiceGameStore((game) => game.answers);

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
