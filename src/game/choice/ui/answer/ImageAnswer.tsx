import clsx from "clsx";
import { useAnimation } from "src/utils/useAnimation";
import { guess } from "../../state";
import type { AnswerProps } from "./Answer";

export function ImageAnswer({ answer, onCorrectGuess }: AnswerProps) {
    const [isWrongAnim, startWrongAnim] = useAnimation(450);
    const handleClick = () => {
        const result = guess(answer.id);
        if (result === "correct") {
            onCorrectGuess();
        } else if (result === "wrong") {
            startWrongAnim();
        }
    };

    return (
        <button
            className={clsx("relative cursor-pointer rounded-[3px] focus-ring transition-[filter] duration-80",
                "hover:brightness-102 dark:hover:brightness-95 dark:active:brightness-90 h-[180px]",
                isWrongAnim && "animate-shake")}
            onClick={handleClick}
        >
            <img
                src={answer.imageURL}
                className="absolute left-0 top-0 size-full"
            />
        </button>
    );
}
