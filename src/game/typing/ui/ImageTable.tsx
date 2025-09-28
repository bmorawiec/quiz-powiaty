import { useContext } from "react";
import { TypingGameStoreContext } from "../storeContext";
import { ImageCell } from "./cell";

export interface ImageTableProps {
    textTransform?: "uppercase" | "capitalize";
}

export function ImageTable({ textTransform }: ImageTableProps) {
    const useTypingGameStore = useContext(TypingGameStoreContext);
    const questionIds = useTypingGameStore((state) => state.questionIds);

    return (
        <div className="w-full max-w-[1000px] grid grid-cols-2 md:grid-cols-4 gap-[20px]">
            {questionIds.map((questionId) =>
                <ImageCell
                    key={questionId}
                    questionId={questionId}
                    textTransform={textTransform}
                />
            )}
        </div>
    );
}
