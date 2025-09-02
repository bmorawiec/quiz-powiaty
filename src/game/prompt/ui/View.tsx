import { InvalidGameOptionsError, type GameOptions } from "src/gameOptions";
import { guess, usePromptGameStore } from "../state";
import { PromptInput } from "./PromptInput";

export interface ViewProps {
    options: GameOptions;
}

export function View({ options }: ViewProps) {
    const prompt = usePromptGameStore((state) => state.prompts[state.current]);

    const inputPlaceholder = getInputPlaceholder(options);
    const textTransform = getTextTransform(options);

    const handleGuess = (answer: string) => {
        return guess(answer);
    };

    return (
        <div className="relative flex-1 bg-gray-5 dark:bg-gray-95 sm:rounded-[20px] flex flex-col items-center 
            pt-[60px] pb-[50px] px-[20px]">
            {prompt.imageURL && (
                <div className="relative w-full max-w-[700px] flex-1 min-h-[200px] max-h-[500px] mb-[30px]">
                    <img
                        className="absolute left-0 top-0 w-full h-full"
                        src={prompt.imageURL}
                    />
                </div>
            )}

            <h2 className="text-[20px] font-[500] mb-[28px] text-gray-80 dark:text-gray-10 mt-auto text-center">
                {prompt.text}
            </h2>
            <PromptInput
                placeholder={inputPlaceholder}
                answered={prompt.provided}
                total={prompt.answers.length}
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
