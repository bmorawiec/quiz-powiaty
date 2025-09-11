import { useContext } from "react";
import { FinishedViewBase } from "../../common";
import { ChoiceGameStoreContext } from "../storeContext";

export interface FinishedViewProps {
    onRestart: () => void;
}

export function FinishedView({ onRestart }: FinishedViewProps) {
    const useChoiceGameStore = useContext(ChoiceGameStoreContext);
    const options = useChoiceGameStore((game) => game.options);
    const questions = useChoiceGameStore((state) => state.questions);

    return (
        <FinishedViewBase
            options={options}
            questions={questions}
            onRestart={onRestart}
        />
    );
}
