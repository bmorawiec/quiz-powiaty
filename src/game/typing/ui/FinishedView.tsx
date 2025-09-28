import { useContext } from "react";
import { FinishedViewBase } from "../../common";
import { TypingGameStoreContext } from "../storeContext";

export interface FinishedViewProps {
    onRestart: () => void;
}

export function FinishedView({ onRestart }: FinishedViewProps) {
    const useTypingGameStore = useContext(TypingGameStoreContext);
    const options = useTypingGameStore((game) => game.options);

    const questions = useTypingGameStore((game) => game.questions);
    const questionIds = useTypingGameStore((game) => game.questionIds);
    const allAnswers = useTypingGameStore((game) => game.answers);

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
