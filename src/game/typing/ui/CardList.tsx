import { useMemo } from "react";
import { useTypingGameStore } from "../state";
import { Card } from "./card";

export interface CardListProps {
    textTransform?: "uppercase" | "capitalize";
}

export function CardList({ textTransform }: CardListProps) {
    const total = useTypingGameStore((state) => state.questions.length);
    const [firstHalf, secondHalf] = useMemo(() => {
        const firstHalfLength = Math.ceil(total / 2);
        const firstHalf = [];
        for (let index = 0; index < firstHalfLength; index++) {
            firstHalf.push(index);
        }
        const secondHalf = [];
        for (let index = firstHalfLength; index < total; index++) {
            secondHalf.push(index);
        }
        return [firstHalf, secondHalf];
    }, [total]);

    return (
        <div className="w-full max-w-[1000px] grid grid-cols-2 gap-[50px] max-md:flex max-md:gap-[10px]
            max-md:flex-col">
            <div className="flex flex-col gap-[10px]">
                {firstHalf.map((index) =>
                    <Card
                        key={index}
                        questionIndex={index}
                        textTransform={textTransform}
                    />
                )}
            </div>

            <div className="flex flex-col gap-[10px]">
                {secondHalf.map((index) =>
                    <Card
                        key={index}
                        questionIndex={index}
                        textTransform={textTransform}
                    />
                )}
            </div>
        </div>
    );
}
