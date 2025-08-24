import clsx from "clsx";
import type { GameOptions } from "src/gameOptions";
import { guess, type QuestionOption } from "./state";
import { useAnimation } from "src/utils/useAnimation";

export interface ImageOptionProps {
    questionOpt: QuestionOption;
    options: GameOptions;
    onCorrectGuess: () => void;
}

export function ImageOption({ questionOpt, options, onCorrectGuess }: ImageOptionProps) {
    const imageUrl = getImageUrl(questionOpt, options);

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
            className={clsx("relative cursor-pointer rounded-[3px] focus-ring transition-[filter] duration-80",
                "hover:brightness-102 dark:hover:brightness-95 dark:active:brightness-90",
                (options.guess === "flag") ? "h-[180px]" : "h-[220px]",
                isWrongAnim && "animate-shake")}
            onClick={handleClick}
        >
            <img
                src={imageUrl}
                className="absolute left-0 top-0 size-full"
            />
        </button>
    )
}

function getImageUrl(option: QuestionOption, options: GameOptions): string {
    if (options.guess === "flag") {
        return "/images/flag/" + option.value + ".svg";
    } else if (options.guess === "coa") {
        return "/images/coa/" + option.value + ".svg";
    } else {
        throw new Error("Cannot display ImageOption component while options.guess is set to neither 'flag' or 'coa'.");
    }
}
