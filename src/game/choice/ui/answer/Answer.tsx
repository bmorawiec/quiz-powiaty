import type { ChoiceAnswer } from "../../state";
import { ImageAnswer } from "./ImageAnswer";
import { TextAnswer } from "./TextAnswer";

export interface AnswerProps {
    answer: ChoiceAnswer;
    onCorrectGuess: () => void;
}

export function Answer({ answer, onCorrectGuess }: AnswerProps) {
    if (answer.imageURL) {
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
