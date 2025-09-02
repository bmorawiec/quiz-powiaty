import clsx from "clsx";
import type { GameOptions } from "src/gameOptions";
import { guess, type QuestionOption } from "../state";
import { useAnimation } from "src/utils/useAnimation";

export interface ImageOptionProps {
    option: QuestionOption;
    gameOptions: GameOptions;
    onCorrectGuess: () => void;
}

export function ImageOption({ option, gameOptions, onCorrectGuess }: ImageOptionProps) {
    const imageUrl = getImageUrl(option, gameOptions);

    const [isWrongAnim, startWrongAnim] = useAnimation(450);
    const handleClick = () => {
        const result = guess(option.id);
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
                (gameOptions.guess === "flag") ? "h-[180px]" : "h-[220px]",
                isWrongAnim && "animate-shake")}
            onClick={handleClick}
        >
            <img
                src={imageUrl}
                className="absolute left-0 top-0 size-full"
            />
        </button>
    );
}

function getImageUrl(option: QuestionOption, gameOptions: GameOptions): string {
    if (gameOptions.guess === "flag") {
        return "/images/flag/" + option.value + ".svg";
    } else if (gameOptions.guess === "coa") {
        return "/images/coa/" + option.value + ".svg";
    } else {
        throw new Error("Cannot display ImageOption component while gameOptions.guess is set to neither 'flag' or 'coa'.");
    }
}
