import { useContext } from "react";
import { FinishedViewBase } from "../../common";
import { MapGameStoreContext } from "../storeContext";

export interface FinishedViewProps {
    onRestart: () => void;
}

export function FinishedView({ onRestart }: FinishedViewProps) {
    const useMapGameStore = useContext(MapGameStoreContext);
    const options = useMapGameStore((game) => game.options);

    const questions = useMapGameStore((game) => game.questions);
    const questionIds = useMapGameStore((game) => game.questionIds);
    const allAnswers = useMapGameStore((game) => game.answers);

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
