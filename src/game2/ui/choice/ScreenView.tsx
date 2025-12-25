import { useContext } from "react";
import { QuestionNotFoundError } from "src/game2/api";
import { type ChoiceScreen } from "src/game2/state";
import { ButtonView } from "./ButtonView";
import { ChoiceGameStoreContext } from "./hook";

export interface ScreenViewProps {
    screen: ChoiceScreen;
}

export function ScreenView({ screen }: ScreenViewProps) {
    const useChoiceGameStore = useContext(ChoiceGameStoreContext);

    const question = useChoiceGameStore((game) => game.api.questions[screen.questionId]);
    if (!question) throw new QuestionNotFoundError(screen.questionId)

    return (
        <div className="flex flex-col items-center">
            <h2 className="h-[56px] text-[20px] font-[450] tracking-[0.01em] text-gray-85">
                {question.content.text}
            </h2>
            <div className="w-full grid grid-cols-2 md:grid-cols-3 gap-[10px]">
                {screen.buttonIds.map((buttonId) =>
                    <ButtonView
                        key={buttonId}
                        buttonId={buttonId}
                    />
                )}
            </div>
        </div>
    );
}
