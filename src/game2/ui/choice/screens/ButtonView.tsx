import { useContext } from "react";
import { ChoiceGameStoreContext } from "../hook";
import { ButtonNotFoundError } from "src/game2/state";
import { AnswerNotFoundError } from "src/game2/api";
import clsx from "clsx";
import { ApplyIcon, CloseIcon } from "src/ui";
import { useAnimation } from "src/utils/useAnimation";

export interface ButtonViewProps {
    buttonId: string;
    disabled?: boolean;
}

/** Shows a button corresponding to an answer.
 *  Checks if the answer associated with this button is correct when enabled and the button is clicked.
 *  When disabled, shows whether the answer associated with this button is correct or not. */
export function ButtonView({ buttonId, disabled }: ButtonViewProps) {
    const useChoiceGameStore = useContext(ChoiceGameStoreContext);

    const button = useChoiceGameStore((game) => game.buttons[buttonId]);
    if (!button) throw new ButtonNotFoundError(buttonId);

    const answer = useChoiceGameStore((game) => game.api.answers[button.answerId]);
    if (!answer) throw new AnswerNotFoundError(button.answerId);

    if (answer.content.type === "feature")
        throw new Error("This component does not support displaying this type of content.");

    const [isWrongAnim, playWrongAnim] = useAnimation(450);
    const guess = useChoiceGameStore((game) => game.guess);
    const handleClick = () => {
        if (!disabled) {
            const result = guess(buttonId);
            if (result === "wrong") {
                playWrongAnim();
            }
        }
    };

    return (
        <button
            className={clsx((answer.content.type === "text") ? "h-[80px]" : "h-[200px]",
                "border rounded-[10px] font-[450] tracking-[0.01em] p-[10px]",
                "transition-colors duration-20 focus-ring flex items-center justify-center gap-[8px]",
                !disabled && "cursor-pointer hover:bg-gray-5 active:bg-gray-10",
                (disabled && answer.correct) ? "border-teal-60 bg-teal-5" : "bg-white border-gray-20",
                isWrongAnim && "animate-shake")}
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
