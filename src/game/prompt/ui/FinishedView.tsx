import { useContext } from "react";
import { FinishedViewBase } from "../../common";
import { PromptGameStoreContext } from "../storeContext";

export interface FinishedViewProps {
    onRestart: () => void;
}

export function FinishedView({ onRestart }: FinishedViewProps) {
    const usePromptGameStore = useContext(PromptGameStoreContext);
    const options = usePromptGameStore((game) => game.options);

    const questions = usePromptGameStore((game) => game.questions);
    const questionIds = usePromptGameStore((game) => game.questionIds);
    const allAnswers = usePromptGameStore((game) => game.answers);

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
