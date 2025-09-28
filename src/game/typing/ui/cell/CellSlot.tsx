import { useContext } from "react";
import { AnswerNotFoundError } from "../../../common";
import type { GuessResult } from "../../state";
import { TypingGameStoreContext } from "../../storeContext";
import { CellInput } from "./CellInput";
import { GuessedAnswer } from "./GuessedAnswer";

export interface CellSlotProps {
    answerId: string;
    slotIndex: number;
    textTransform?: "uppercase" | "capitalize";
    onGuess: (text: string, slotIndex: number) => GuessResult;
}

export function CellSlot({ answerId, slotIndex, textTransform, onGuess }: CellSlotProps) {
    const useTypingGameStore = useContext(TypingGameStoreContext);

    const answer = useTypingGameStore((game) => game.answers[answerId]);
    if (!answer)
        throw new AnswerNotFoundError(answerId);

    if (answer.guessed) {
        return (
            <GuessedAnswer
                text={answer.value}
            />
        );
    } else {
        return (
            <CellInput
                textTransform={textTransform}
                slotIndex={slotIndex}
                onGuess={onGuess}
            />
        );
    }
}
