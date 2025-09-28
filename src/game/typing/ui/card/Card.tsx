import { useContext, useState } from "react";
import { InfoIcon } from "src/ui";
import { QuestionNotFoundError } from "../../../common";
import { type GuessResult } from "../../state";
import { TypingGameStoreContext } from "../../storeContext";
import { CellSlot } from "./CellSlot";

export interface CardProps {
    questionId: string;
    textTransform?: "uppercase" | "capitalize";
}

export function Card({ questionId, textTransform }: CardProps) {
    const useTypingGameStore = useContext(TypingGameStoreContext);
    const guess = useTypingGameStore((game) => game.guess);

    const question = useTypingGameStore((state) => state.questions[questionId]);
    if (!question)
        throw new QuestionNotFoundError(questionId);

    const [result, setResult] = useState<GuessResult | null>(null);
    const [hint, setHint] = useState<string | null>(null);

    const handleGuess = (text: string, slotIndex: number) => {
        const [result, hint] = guess(questionId, text, slotIndex);
        setResult(result);
        if (result === "correct") {
            setHint(null);
        } else if (hint) {
            setHint(hint);
        }
        return result;
    };

    return (<>
        <div className="bg-white dark:bg-gray-90 rounded-[15px] p-[10px] grid grid-cols-2">
            <p className="text-[14px] tracking-[0.01em] ml-[6px] mt-[6px] mr-[10px]">
                {question.value}
            </p>

            <div className="flex flex-col gap-[6px]">
                {question.answerIds.map((answerId, index) =>
                    <CellSlot
                        key={index}
                        answerId={answerId}
                        slotIndex={index}
                        textTransform={textTransform}
                        onGuess={handleGuess}
                    />
                )}
            </div>
        </div>

        {(result === "alreadyGuessed" || hint) && (
            <div className="pl-[10px] pb-[2px] flex items-center gap-[4px] text-[14px]">
                <InfoIcon className="size-[12px]"/>
                {result === "alreadyGuessed" && (
                    <span>
                        Już zgadłeś tą odpowiedź.
                    </span>
                )}
                {hint && (
                    <span>
                        Podpowiedź: {hint}
                    </span>
                )}
            </div>
        )}
    </>);
}
