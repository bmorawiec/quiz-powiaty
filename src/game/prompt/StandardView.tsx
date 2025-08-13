import type { GameOptions } from "../common";
import { PromptInput } from "../ui";
import { guess, usePromptGameStore } from "./state";

export interface StandardViewProps {
    options: GameOptions;
}

export function StandardView({ options }: StandardViewProps) {
    const prompt = usePromptGameStore((state) => state.prompts[state.current]);

    const inputPlaceholder = getInputPlaceholder(options);
    const textTransform = getTextTransform(options);

    const handleGuess = (answer: string) => {
        return guess(answer);
    };

    return (
        <div className="flex-1 bg-gray-5 dark:bg-gray-95 md:rounded-[20px] flex flex-col items-center justify-end
            pt-[60px] pb-[50px]">
            <h2 className="text-[20px] font-[500] mb-[28px] text-gray-80 dark:text-gray-10">
                {prompt.question}
            </h2>
            <PromptInput
                placeholder={inputPlaceholder}
                answered={prompt.provided}
                total={prompt.answers.length}
                textTransform={textTransform}
                className="w-[700px]"
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
    throw new Error("Invalid game options.");
}

function getTextTransform(options: GameOptions): "uppercase" | "capitalize" | undefined {
    if (options.guess === "capital") {
        return "capitalize";
    } else if (options.guess === "plate") {
        return "uppercase";
    }
}
