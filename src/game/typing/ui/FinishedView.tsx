import { useContext } from "react";
import { FinishedViewBase } from "../../common";
import { TypingGameStoreContext } from "../storeContext";

export interface FinishedViewProps {
    onRestart: () => void;
}

export function FinishedView({ onRestart }: FinishedViewProps) {
    const useTypingGameStore = useContext(TypingGameStoreContext);
    const options = useTypingGameStore((game) => game.options);
    const questions = useTypingGameStore((state) => state.questions);

    return (
        <FinishedViewBase
            options={options}
            questions={questions}
            onRestart={onRestart}
        />
    );
}
