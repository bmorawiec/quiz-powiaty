import { useState } from "react";
import type { GameOptions } from "../common";
import { PromptInput } from "../ui";
import { guess, usePromptGameStore, type GuessResult } from "./state";

export interface StandardViewProps {
    options: GameOptions;
}

export function StandardView({ options }: StandardViewProps) {
    const prompt = usePromptGameStore((state) => state.prompts[state.current]);
    const inputPlaceholder = getInputPlaceholder(options);

    const [guessResult, setGuessResult] = useState<GuessResult | null>("correct");

    const handleGuess = (answer: string) => {
        const result = guess(answer);
        setGuessResult(result);
    };

    const handleClearState = () => {
        setGuessResult(null);
    };

    return (
        <div className="flex-1 bg-gray-5 dark:bg-gray-95 md:rounded-[20px] flex flex-col items-center justify-end
            pt-[60px] pb-[50px]">
            <h2 className="text-[20px] font-[500] mb-[28px] text-gray-80 dark:text-gray-10">
                {prompt.question}
            </h2>
            <PromptInput
                placeholder={inputPlaceholder}
                state={guessResult}
                className="w-[700px]"
                onGuess={handleGuess}
                onClearState={handleClearState}
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
