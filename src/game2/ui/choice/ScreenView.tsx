import { useContext } from "react";
import { QuestionNotFoundError } from "src/game2/api";
import { ChoiceScreenNotFoundError } from "src/game2/state";
import { ChoiceGameStoreContext } from "./hook";
import { ButtonView } from "./ButtonView";

export interface ScreenViewProps {
    screenId: string;
}

export function ScreenView({ screenId }: ScreenViewProps) {
    const useChoiceGameStore = useContext(ChoiceGameStoreContext);

    const screen = useChoiceGameStore((game) => game.screens[screenId]);
    if (!screen) throw new ChoiceScreenNotFoundError(screenId);

    const question = useChoiceGameStore((game) => game.api.questions[screen.questionId]);
    if (!question) throw new QuestionNotFoundError(screen.questionId)

    return (
        <div className="h-[230px] flex flex-col items-center">
            <h2 className="h-[56px] text-[20px] font-[450] tracking-[0.01em] text-gray-85">
                {question.text}
            </h2>
            <div className="w-full grid grid-cols-3 gap-[10px]">
                {screen.buttonIds.map((buttonId) =>
                    <ButtonView buttonId={buttonId}/>
                )}
            </div>
        </div>
    );
}
