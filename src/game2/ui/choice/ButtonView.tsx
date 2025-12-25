import { useContext } from "react";
import { ChoiceGameStoreContext } from "./hook";
import { ButtonNotFoundError } from "src/game2/state";
import { AnswerNotFoundError } from "src/game2/api";
import clsx from "clsx";

export interface ButtonViewProps {
    buttonId: string;
}

export function ButtonView({ buttonId }: ButtonViewProps) {
    const useChoiceGameStore = useContext(ChoiceGameStoreContext);

    const button = useChoiceGameStore((game) => game.buttons[buttonId]);
    if (!button) throw new ButtonNotFoundError(buttonId);

    const answer = useChoiceGameStore((game) => game.api.answers[button.answerId]);
    if (!answer) throw new AnswerNotFoundError(button.answerId);

    if (answer.content.type === "feature")
        throw new Error("This component does not support displaying this type of content.");

    const guess = useChoiceGameStore((game) => game.guess);
    const handleClick = () => {
        guess(buttonId);
    };

    return (
        <button
            className={clsx((answer.content.type === "text") ? "h-[80px]" : "h-[200px]",
                "border rounded-[10px] font-[450] tracking-[0.01em] cursor-pointer p-[10px]",
                "transition-colors duration-20 focus-ring",
                "border-gray-20 bg-white hover:bg-gray-5 active:bg-gray-10")}
            onClick={handleClick}
        >
            {(answer.content.type === "text") ? (
                answer.content.text
            ) : (
                <div
                    className="size-full bg-contain bg-center bg-no-repeat"
                    style={{
                        backgroundImage: `url(${answer.content.url})`,
                    }}
                />
            )}
        </button>
    );
}
