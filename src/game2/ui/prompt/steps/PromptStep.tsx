import { useContext } from "react";
import { PromptScreenNotFoundError } from "src/game2/state";
import { FinalStep } from "./FinalStep";
import { PromptGameStoreContext } from "../hook";
import { QuestionStep } from "./QuestionStep";

export interface PromptStepProps {
    screenId: string;
    index: number;
}

export function PromptStep({ screenId, index }: PromptStepProps) {
    const usePromptGameStore = useContext(PromptGameStoreContext);
    const screen = usePromptGameStore((game) => game.screens[screenId]);
    if (!screen)
        throw new PromptScreenNotFoundError(screenId);

    if (screen.final) {
        return <FinalStep screen={screen}/>;
    } else {
        return (
            <QuestionStep
                screen={screen}
                index={index}
            />
        );
    }
}
