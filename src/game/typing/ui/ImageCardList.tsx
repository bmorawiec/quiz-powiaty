import { useMemo } from "react";
import { useTypingGameStore } from "../state";
import { ImageCard } from "./card";

export interface ImageCardListProps {
    textTransform?: "uppercase" | "capitalize";
}

export function ImageCardList({ textTransform }: ImageCardListProps) {
    const total = useTypingGameStore((state) => state.questions.length);
    const questionIndexes = useMemo(() => {
        const indexes = [];
        for (let index = 0; index < total; index++) {
            indexes.push(index);
        }
        return indexes;
    }, [total]);

    return (
        <div className="w-full max-w-[1000px] grid grid-cols-2 md:grid-cols-4 gap-[20px]">
            {questionIndexes.map((index) =>
                <ImageCard
                    key={index}
                    questionIndex={index}
                    textTransform={textTransform}
                />
            )}
        </div>
    );
}
