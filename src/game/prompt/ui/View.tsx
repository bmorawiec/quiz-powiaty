import { useContext } from "react";
import { InvalidGameOptionsError, type GameOptions } from "src/gameOptions";
import { PromptGameStoreContext } from "../storeContext";
import { PromptInput } from "./PromptInput";
import { QuestionNotFoundError } from "src/game/common";

export function View() {
    const usePromptGameStore = useContext(PromptGameStoreContext);

    const options = usePromptGameStore((game) => game.options);
    const title = usePromptGameStore((game) => game.title);

    const questionId = usePromptGameStore((game) => game.current);
    const question = usePromptGameStore((game) => game.questions[questionId]);
    if (!question)
        throw new QuestionNotFoundError(questionId);

    const inputPlaceholder = getInputPlaceholder(options);
    const textTransform = getTextTransform(options);

    const guess = usePromptGameStore((game) => game.guess);
    const handleGuess = (answer: string) => {
        return guess(answer);
    };

    return (
        <div className="relative flex-1 bg-gray-5 dark:bg-gray-95 sm:rounded-[20px] flex flex-col items-center 
            pt-[60px] pb-[50px] max-sm:pb-[120px] px-[20px]">
            {(options.guessFrom === "flag" || options.guessFrom === "coa") && (
                <div className="relative w-full max-w-[700px] flex-1 min-h-[200px] max-h-[500px] mb-[30px]">
                    <img
                        className="absolute left-0 top-0 w-full h-full"
                        src={question.value}
                    />
                </div>
            )}

            <h2 className="text-[20px] font-[500] mb-[28px] text-gray-80 dark:text-gray-10 mt-auto text-center">
                {title || question.value}
            </h2>
            <PromptInput
                placeholder={inputPlaceholder}
                answered={question.provided}
                total={question.answerIds.length}
                textTransform={textTransform}
                className="w-full max-w-[700px]"
                onGuess={handleGuess}
            />
        </div>
    );
}

function getInputPlaceholder(options: GameOptions): string {
    if (options.guess === "name") {
        return "Wpisz nazwę...";
    } else if (options.guess === "capital") {
        return "Wpisz nazwę stolicy...";
    } else if (options.guess === "plate") {
        return "Wpisz rejestrację...";
    }
    throw new InvalidGameOptionsError();
}

function getTextTransform(options: GameOptions): "uppercase" | "capitalize" | undefined {
    if (options.guess === "capital") {
        return "capitalize";
    } else if (options.guess === "plate") {
        return "uppercase";
    }
}
