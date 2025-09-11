import { useContext } from "react";
import { FinishedViewBase } from "../../common";
import { PromptGameStoreContext } from "../storeContext";

export interface FinishedViewProps {
    onRestart: () => void;
}

export function FinishedView({ onRestart }: FinishedViewProps) {
    const usePromptGameStore = useContext(PromptGameStoreContext);
    const options = usePromptGameStore((game) => game.options);
    const prompts = usePromptGameStore((state) => state.prompts);

    return (
        <FinishedViewBase
            options={options}
            questions={prompts}
            onRestart={onRestart}
        />
    );
}
