import clsx from "clsx";
import { useContext } from "react";
import { useAnimation } from "src/utils/useAnimation";
import { ChoiceGameStoreContext } from "../storeContext";
import { Answer } from "./answer";

export function View() {
    const useChoiceGameStore = useContext(ChoiceGameStoreContext);

    const options = useChoiceGameStore((game) => game.options);
    const title = useChoiceGameStore((game) => game.title);
    const questionValue = useChoiceGameStore((state) => state.questions[state.current].value);
    const questionAnswers = useChoiceGameStore((state) => state.questions[state.current].answers);

    const [isCorrectAnim, startCorrectAnim] = useAnimation(450);
    const handleCorrectGuess = () => {
        startCorrectAnim();
    };

    return (
        <div className={clsx("relative flex-1 bg-gray-5 dark:bg-gray-95 sm:rounded-[20px] flex flex-col items-center",
            "pt-[60px] pb-[50px] max-sm:pb-[120px] px-[20px]",
            isCorrectAnim && "animate-correct dark:animate-correct-dark")}>
            {(options.guessFrom === "flag" || options.guessFrom === "coa") && (
                <div className="relative w-full max-w-[700px] flex-1 min-h-[200px] max-h-[500px] mb-[30px]">
                    <img
                        className="absolute left-0 top-0 w-full h-full"
                        src={questionValue}
                    />
                </div>
            )}

            <h2 className="text-[20px] font-[500] mb-[28px] text-gray-80 dark:text-gray-10 mt-auto text-center">
                {title || questionValue}
            </h2>

            <div className="w-full max-w-[1000px] grid grid-cols-2 md:grid-cols-3 gap-[10px]">
                {questionAnswers.map((answer) =>
                    <Answer
                        key={answer.id}
                        answer={answer}
                        options={options}
                        onCorrectGuess={handleCorrectGuess}
                    />
                )}
            </div>
        </div>
    );
}
