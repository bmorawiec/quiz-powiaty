import clsx from "clsx";
import { useContext } from "react";
import { AnswerNotFoundError } from "src/game2/questions";
import { ButtonNotFoundError } from "src/game2/state";
import { useAnimation } from "src/utils/useAnimation";
import { ChoiceGameStoreContext } from "../../../hook";
import { ButtonContentView } from "./ButtonContentView";
import { VerificationBadge } from "./VerificationBadge";

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
            className={clsx("relative border rounded-[10px]",
                "transition-colors duration-20 focus-ring",
                !disabled && "cursor-pointer hover:bg-gray-5 active:bg-gray-10 " +
                    "dark:hover:bg-white/8 dark:active:bg-white/4",
                (disabled && answer.correct)
                    ? "border-teal-60 bg-teal-5 dark:border-teal-80 dark:bg-teal-95"
                    : "bg-white border-gray-20 dark:bg-white/5 dark:border-none",
                isWrongAnim && "animate-shake")}
            onClick={handleClick}
        >
            <ButtonContentView content={answer.content}/>
            {disabled && <VerificationBadge correct={answer.correct}/>}
        </button>
    );
}
