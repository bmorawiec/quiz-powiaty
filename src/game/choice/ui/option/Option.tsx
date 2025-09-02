import type { ChoiceAnswer } from "../../state";
import { ImageOption } from "./ImageOption";
import { TextOption } from "./TextOption";

export interface OptionProps {
    option: ChoiceAnswer;
    onCorrectGuess: () => void;
}

export function Option({ option, onCorrectGuess }: OptionProps) {
    if (option.imageURL) {
        return (
            <ImageOption
                option={option}
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
