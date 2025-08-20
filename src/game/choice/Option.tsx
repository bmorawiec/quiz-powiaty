import clsx from "clsx";
import { useAnimation } from "src/utils/useAnimation";
import { guess, type QuestionOption } from "./state";

export interface OptionProps {
    questionOpt: QuestionOption;
    onCorrectGuess: () => void;
}

export function Option({ questionOpt, onCorrectGuess }: OptionProps) {
    const [isWrongAnim, startWrongAnim] = useAnimation(450);
    const handleClick = () => {
        const result = guess(questionOpt.id);
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
                "bg-white border border-gray-20 hover:border-gray-30",
                isWrongAnim && "animate-shake")}
            onClick={handleClick}
        >
            {questionOpt.value}
        </button>
    )
}
