import clsx from "clsx";
import { useContext, useMemo } from "react";
import { useAnimation } from "src/utils/useAnimation";
import { ChoiceGameStoreContext } from "../storeContext";
import { Answer } from "./answer";
import { QuestionNotFoundError } from "src/game/common";

export function View() {
    const useChoiceGameStore = useContext(ChoiceGameStoreContext);

    const options = useChoiceGameStore((game) => game.options);
    const title = useChoiceGameStore((game) => game.title);

    const questionId = useChoiceGameStore((state) => state.current);
    const [answerIds, value] = useMemo(() => {
        const game = useChoiceGameStore.getState();
        const question = game.questions[questionId];
        if (!question)
            throw new QuestionNotFoundError(questionId);
        return [question.answerIds, question.value];
    }, [questionId]);   // only update when current question changes

    const [isCorrectAnim, startCorrectAnim] = useAnimation(450);
    const handleCorrectGuess = () => {
        startCorrectAnim();
    };

    return (
        <div className={clsx("relative size-full bg-gray-5 dark:bg-gray-95 sm:rounded-[20px]",
            "flex flex-col items-center pt-[60px] pb-[50px] max-sm:pb-[120px] px-[20px]",
            isCorrectAnim && "animate-correct dark:animate-correct-dark")}>
            {(options.guessFrom === "flag" || options.guessFrom === "coa") && (
                <div className="relative w-full max-w-[700px] flex-1 min-h-[200px] max-h-[500px] mb-[30px]">
                    <img
                        className="absolute left-0 top-0 w-full h-full"
                        src={value}
                    />
                </div>
            )}

            <h2 className="text-[20px] font-[500] mb-[28px] text-gray-80 dark:text-gray-10 mt-auto text-center">
                {title || value}
            </h2>

            <div className="w-full max-w-[1000px] grid grid-cols-2 md:grid-cols-3 gap-[10px]">
                {answerIds.map((answerId) =>
                    <Answer
                        key={answerId}
                        answerId={answerId}
                        options={options}
                        onCorrectGuess={handleCorrectGuess}
                    />
                )}
            </div>
        </div>
    );
}
