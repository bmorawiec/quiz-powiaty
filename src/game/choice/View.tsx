import clsx from "clsx";
import { useAnimation } from "src/utils/useAnimation";
import type { GameOptions } from "../common";
import { ImageOption } from "./ImageOption";
import { Option } from "./Option";
import { useQuestionGameStore, type Question } from "./state";

export interface ViewProps {
    options: GameOptions;
}

export function View({ options }: ViewProps) {
    const question = useQuestionGameStore((state) => state.questions[state.current]);

    const imageUrl = getImageUrl(question, options);

    const [isCorrectAnim, startCorrectAnim] = useAnimation(450);
    const handleCorrectGuess = () => {
        startCorrectAnim();
    };

    return (
        <div className={clsx("relative flex-1 bg-gray-5 dark:bg-gray-95 sm:rounded-[20px] flex flex-col items-center",
            "pt-[60px] pb-[50px] px-[20px]",
            isCorrectAnim && "animate-correct")}>
            {imageUrl && (
                <div className="relative w-full max-w-[700px] flex-1 min-h-[200px] max-h-[500px] mb-[30px]">
                    <img
                        className="absolute left-0 top-0 w-full h-full"
                        src={imageUrl}
                    />
                </div>
            )}

            <h2 className="text-[20px] font-[500] mb-[28px] text-gray-80 dark:text-gray-10 mt-auto">
                {question.value}
            </h2>

            {(options.guess === "flag" || options.guess === "coa") ? (
                <div className="w-full max-w-[1000px] grid grid-cols-2 md:grid-cols-3 gap-[20px]">
                    {question.options.map((option) =>
                        <ImageOption
                            key={option.id}
                            questionOpt={option}
                            options={options}
                            onCorrectGuess={handleCorrectGuess}
                        />
                    )}
                </div>
            ) : (
                <div className="w-full max-w-[1000px] grid grid-cols-2 md:grid-cols-3 gap-[10px]">
                    {question.options.map((option) =>
                        <Option
                            key={option.id}
                            questionOpt={option}
                            onCorrectGuess={handleCorrectGuess}
                        />
                    )}
                </div>
            )}
        </div>
    );
}

function getImageUrl(question: Question, options: GameOptions): string | null {
    if (options.guessFrom === "flag") {
        return "/images/flag/" + question.about + ".svg";
    } else if (options.guessFrom === "coa") {
        return "/images/coa/" + question.about + ".svg";
    } else {
        return null;
    }
}
