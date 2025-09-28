import { useContext, useMemo } from "react";
import { Card } from "./card";
import { TypingGameStoreContext } from "../storeContext";

export interface CardListProps {
    textTransform?: "uppercase" | "capitalize";
}

export function CardList({ textTransform }: CardListProps) {
    const useTypingGameStore = useContext(TypingGameStoreContext);

    const questionIds = useTypingGameStore((state) => state.questionIds);
    const [firstHalf, secondHalf] = useMemo(() => {
        const firstHalfLength = Math.ceil(questionIds.length / 2);
        const firstHalf = questionIds.slice(0, firstHalfLength);
        const secondHalf = questionIds.slice(firstHalfLength);
        return [firstHalf, secondHalf];
    }, [questionIds]);

    return (
        <div className="w-full max-w-[1000px] grid grid-cols-2 gap-[50px] max-md:flex max-md:gap-[10px]
            max-md:flex-col">
            <div className="flex flex-col gap-[10px]">
                {firstHalf.map((questionId) =>
                    <Card
                        key={questionId}
                        questionId={questionId}
                        textTransform={textTransform}
                    />
                )}
            </div>

            <div className="flex flex-col gap-[10px]">
                {secondHalf.map((questionId) =>
                    <Card
                        key={questionId}
                        questionId={questionId}
                        textTransform={textTransform}
                    />
                )}
            </div>
        </div>
    );
}
