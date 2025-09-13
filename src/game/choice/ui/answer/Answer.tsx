import type { GameOptions } from "src/gameOptions";
import type { ChoiceAnswer } from "../../state";
import { ImageAnswer } from "./ImageAnswer";
import { TextAnswer } from "./TextAnswer";

export interface AnswerProps {
    answer: ChoiceAnswer;
    options: GameOptions;
    onCorrectGuess: () => void;
}

export function Answer({ answer, options, onCorrectGuess }: AnswerProps) {
    if (options.guess === "flag" || options.guess === "coa") {
        return (
            <ImageAnswer
                answer={answer}
                onCorrectGuess={onCorrectGuess}
            />
        );
    }
    return (
        <TextAnswer
            answer={answer}
            onCorrectGuess={onCorrectGuess}
        />
    );
}
