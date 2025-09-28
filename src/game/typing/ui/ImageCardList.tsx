import { useContext } from "react";
import { TypingGameStoreContext } from "../storeContext";
import { ImageCard } from "./card";

export interface ImageCardListProps {
    textTransform?: "uppercase" | "capitalize";
}

export function ImageCardList({ textTransform }: ImageCardListProps) {
    const useTypingGameStore = useContext(TypingGameStoreContext);
    const questionIds = useTypingGameStore((state) => state.questionIds);

    return (
        <div className="w-full max-w-[1000px] grid grid-cols-2 md:grid-cols-4 gap-[20px]">
            {questionIds.map((questionId) =>
                <ImageCard
                    key={questionId}
                    questionId={questionId}
                    textTransform={textTransform}
                />
            )}
        </div>
    );
}
