import { useState } from "react";
import { UnitNotFoundError, units } from "src/data";
import type { GameOptions } from "../common";
import { PromptInput } from "../ui";
import { guess, type GuessResult, usePromptGameStore, type PromptState } from "./state";
import { PromptStateNotFoundError } from "./state/errors";

export interface StandardViewProps {
    options: GameOptions;
}

export function StandardView({ options }: StandardViewProps) {
    const inputPlaceholder = getInputPlaceholder(options);

    const promptId = usePromptGameStore((state) => state.prompts.current);
    const promptState = usePromptGameStore((state) => state.prompts.states[promptId]);
    if (!promptState)
        throw new PromptStateNotFoundError(promptId);
    const promptText = getPromptText(promptState, options);

    const [guessResult, setGuessResult] = useState<GuessResult>("correct");

    const handleGuess = (answer: string) => {
        const result = guess(answer);
        setGuessResult(result);
    };

    return (
        <div className="flex-1 bg-gray-5 dark:bg-gray-95 md:rounded-[20px] flex flex-col items-center justify-end
            pt-[60px] pb-[50px]">
            <h2 className="text-[20px] font-[500] mb-[28px] text-gray-80 dark:text-gray-10">
                {promptText}
            </h2>
            <PromptInput
                placeholder={inputPlaceholder}
                state={guessResult}
                onGuess={handleGuess}
                className="w-[700px]"
            />
        </div>
    );
}

function getPromptText(promptState: PromptState, options: GameOptions): string {
    const unit = units.find((unit) => unit.id === promptState.id);
    if (!unit)
        throw new UnitNotFoundError(promptState.id);


    if (options.guessFrom === "name") {
        if (options.guess === "capital" || options.guess === "allCapitals") {
            return "Jakie stolice ma województwo " + unit.name + "?";
        } else if (options.guess === "plate" || options.guess === "allPlates") {
            const nameWithPrefix = (unit.tags.includes("voivodeship"))
                ? "województwo " + unit.name
                : (unit.tags.includes("city"))
                    ? "miasto " + unit.name
                    : "powiat " + unit.name;
            return "Jaką rejestrację ma " + nameWithPrefix + "?";
        }
    } else if (options.guessFrom === "allCapitals") {
        if (unit.capitals.length === 1) {
            return "Jakie województwo ma stolicę " + unit.capitals[0] + "?";
        } else {
            return "Jakie województwo ma stolice " + unit.capitals.join(", ") + "?";
        }
    } else if (options.guessFrom === "allPlates") {
        const prefix = (unit.tags.includes("voivodeship")) ? "Jakie województwo" : "Jaki powiat";
        if (unit.plates.length === 1) {
            return prefix + " ma rejestrację " + unit.plates[0] + "?";
        } else {
            return prefix + " ma rejestracje " + unit.plates.join(", ") + "?";
        }
    } else if (options.guessFrom === "flag" || options.guessFrom === "coa") {
        const prefix = (unit.tags.includes("voivodeship")) ? "województwa" : "powiatu";
        const suffix = (options.guessFrom === "flag") ? "flaga" : "herb";
        return "Jakiego " + prefix + " to " + suffix + "?";
    }
    throw new Error("Invalid game options.");
}

function getInputPlaceholder(options: GameOptions): string {
    if (options.guess === "name") {
        return "Wpisz nazwę...";
    } else if (options.guess === "capital" || options.guess === "allCapitals") {
        return "Wpisz nazwę stolicy...";
    } else if (options.guess === "plate" || options.guess === "allPlates") {
        return "Wpisz rejestrację...";
    }
    throw new Error("Invalid game options.");
}
