import { useContext } from "react";
import { ChoiceGameStoreContext } from "../hook";
import { ButtonNotFoundError } from "src/game2/state";
import { AnswerNotFoundError } from "src/game2/api";
import clsx from "clsx";
import { ApplyIcon, CloseIcon } from "src/ui";

export interface ButtonViewProps {
    buttonId: string;
    disabled?: boolean;
}

export function ButtonView({ buttonId, disabled }: ButtonViewProps) {
    const useChoiceGameStore = useContext(ChoiceGameStoreContext);

    const button = useChoiceGameStore((game) => game.buttons[buttonId]);
    if (!button) throw new ButtonNotFoundError(buttonId);

    const answer = useChoiceGameStore((game) => game.api.answers[button.answerId]);
    if (!answer) throw new AnswerNotFoundError(button.answerId);

    if (answer.content.type === "feature")
        throw new Error("This component does not support displaying this type of content.");

    const guess = useChoiceGameStore((game) => game.guess);
    const handleClick = () => {
        if (!disabled) {
            guess(buttonId);
        }
    };

    return (
        <button
            className={clsx((answer.content.type === "text") ? "h-[80px]" : "h-[200px]",
                "border rounded-[10px] font-[450] tracking-[0.01em] p-[10px]",
                "transition-colors duration-20 focus-ring flex items-center justify-center gap-[8px]",
                !disabled && "cursor-pointer hover:bg-gray-5 active:bg-gray-10",
                (disabled && answer.correct) ? "border-teal-60 bg-teal-5" : "bg-white border-gray-20")}
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

            {disabled && ((answer.correct)
                ? <ApplyIcon className="size-[14px] text-teal-75"/>
                : <CloseIcon className="size-[14px] text-red-70"/>)}
        </button>
    );
}
