import { useContext } from "react";
import { ChoiceGameStoreContext } from "./hook";
import { ButtonNotFoundError } from "src/game2/state";
import { AnswerNotFoundError } from "src/game2/api";

export interface ButtonViewProps {
    buttonId: string;
}

export function ButtonView({ buttonId }: ButtonViewProps) {
    const useChoiceGameStore = useContext(ChoiceGameStoreContext);

    const button = useChoiceGameStore((game) => game.buttons[buttonId]);
    if (!button) throw new ButtonNotFoundError(buttonId);

    const answer = useChoiceGameStore((game) => game.api.answers[button.answerId]);
    if (!answer) throw new AnswerNotFoundError(button.answerId);

    return (
        <button className="h-[80px] border rounded-[10px] font-[450] tracking-[0.01em] cursor-pointer
            transition-colors duration-20 focus-ring
            border-gray-20 bg-white hover:bg-gray-5 active:bg-gray-10">
            {answer.text}
        </button>
    );
}
