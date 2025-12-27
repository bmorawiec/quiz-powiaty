import { useContext } from "react";
import { ChoiceScreenNotFoundError } from "src/game2/state";
import { FinalStep } from "./FinalStep";
import { ChoiceGameStoreContext } from "../hook";
import { QuestionStep } from "./QuestionStep";

export interface ChoiceStepProps {
    screenId: string;
    index: number;
}

export function ChoiceStep({ screenId, index }: ChoiceStepProps) {
    const useChoiceGameStore = useContext(ChoiceGameStoreContext);
    const screen = useChoiceGameStore((game) => game.screens[screenId]);
    if (!screen)
        throw new ChoiceScreenNotFoundError(screenId);

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
