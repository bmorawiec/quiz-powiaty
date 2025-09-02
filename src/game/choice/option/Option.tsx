import type { GameOptions } from "src/gameOptions";
import type { QuestionOption } from "../state";
import { ImageOption } from "./ImageOption";
import { TextOption } from "./TextOption";

export interface OptionProps {
    option: QuestionOption;
    gameOptions: GameOptions;
    onCorrectGuess: () => void;
}

export function Option({ option, gameOptions, onCorrectGuess }: OptionProps) {
    if (gameOptions.guess === "flag" || gameOptions.guess === "coa") {
        return (
            <ImageOption
                option={option}
                gameOptions={gameOptions}
                onCorrectGuess={onCorrectGuess}
            />
        );
    }
    return (
        <TextOption
            option={option}
            onCorrectGuess={onCorrectGuess}
        />
    );
}
