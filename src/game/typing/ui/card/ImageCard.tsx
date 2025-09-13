import { useContext, useMemo, useState } from "react";
import { InfoIcon } from "src/ui";
import { type GuessResult } from "../../state";
import { TypingGameStoreContext } from "../../storeContext";
import { CardInput } from "./CardInput";
import { GuessedAnswer } from "./GuessedAnswer";

export interface ImageCardProps {
    questionIndex: number;
    textTransform?: "uppercase" | "capitalize";
}

export function ImageCard({ questionIndex, textTransform }: ImageCardProps) {
    const useTypingGameStore = useContext(TypingGameStoreContext);
    const guess = useTypingGameStore((game) => game.guess);

    const question = useTypingGameStore((state) => state.questions[questionIndex]);

    const slotIndexes = useMemo(() => {
        const indexes = [];
        for (let index = 0; index < question.answers.length; index++) {
            indexes.push(index);
        }
        return indexes;
    }, [question.answers.length]);

    const [result, setResult] = useState<GuessResult | null>(null);
    const [hint, setHint] = useState<string | null>(null);

    const handleGuess = (text: string, slotIndex: number) => {
        const [result, hint] = guess(question.id, text, slotIndex);
        setResult(result);
        if (result === "correct") {
            setHint(null);
        } else if (hint) {
            setHint(hint);
        }
        return result;
    };

    return (<>
        <div className="bg-white dark:bg-gray-90 rounded-[15px] p-[10px] pt-[15px] flex flex-col gap-[15px]">
            <img
                className="aspect-3/2"
                src={question.value}
            />

            <div className="flex flex-col gap-[6px]">
                {slotIndexes.map((slotIndex) => {
                    const answer = question.answers.find((answer) => answer.slotIndex === slotIndex);
                    if (answer) {
                        return (
                            <GuessedAnswer
                                key={slotIndex}
                                text={answer.value}
                            />
                        );
                    }
                    return (
                        <CardInput
                            key={slotIndex}
                            textTransform={textTransform}
                            slotIndex={slotIndex}
                            onGuess={handleGuess}
                        />
                    );
                })}
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
