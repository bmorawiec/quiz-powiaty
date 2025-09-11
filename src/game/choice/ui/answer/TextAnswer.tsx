import clsx from "clsx";
import { useContext } from "react";
import { useAnimation } from "src/utils/useAnimation";
import { ChoiceGameStoreContext } from "../../storeContext";
import type { AnswerProps } from "./Answer";

export function TextAnswer({ answer, onCorrectGuess }: AnswerProps) {
    const useChoiceGameStore = useContext(ChoiceGameStoreContext);
    const guess = useChoiceGameStore((state) => state.guess);

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
            className={clsx("h-[80px] px-[20px] flex items-center justify-center rounded-[10px] font-[450]",
                "cursor-pointer transition-colors duration-20 focus-ring",
                "border border-gray-15 bg-white hover:bg-gray-5 active:bg-gray-10",
                "dark:border-none dark:bg-gray-90 dark:hover:bg-gray-85 dark:active:bg-gray-90",
                isWrongAnim && "animate-shake")}
            onClick={handleClick}
        >
            {answer.text}
        </button>
    );
}
