import { useContext } from "react";
import { AnswerNotFoundError } from "src/game/common";
import type { GameOptions } from "src/gameOptions";
import { ChoiceGameStoreContext } from "../../storeContext";
import { ImageAnswer } from "./ImageAnswer";
import { TextAnswer } from "./TextAnswer";

export interface AnswerProps {
    answerId: string;
    options: GameOptions;
    onCorrectGuess: () => void;
}

export function Answer({ answerId, options, onCorrectGuess }: AnswerProps) {
    const useChoiceGameStore = useContext(ChoiceGameStoreContext);
    const answer = useChoiceGameStore((game) => game.answers[answerId]);
    if (!answer)
        throw new AnswerNotFoundError(answerId);

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
