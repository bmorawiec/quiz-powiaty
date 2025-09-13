import clsx from "clsx";
import { useContext } from "react";
import { useAnimation } from "src/utils/useAnimation";
import type { ChoiceAnswer } from "../../state";
import { ChoiceGameStoreContext } from "../../storeContext";

export interface TextAnswerProps {
    answer: ChoiceAnswer;
    onCorrectGuess: () => void;
}

export function TextAnswer({ answer, onCorrectGuess }: TextAnswerProps) {
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
            {answer.value}
        </button>
    );
}
