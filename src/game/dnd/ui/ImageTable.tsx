import { useContext } from "react";
import { DnDGameStoreContext } from "../storeContext";
import { ImageCell } from "./cell";

export function ImageTable() {
    const useDnDGameStore = useContext(DnDGameStoreContext);
    const questionIds = useDnDGameStore((state) => state.questionIds);

    return (
        <div className="w-full max-w-[1000px] grid grid-cols-2 md:grid-cols-4 gap-[20px]">
            {questionIds.map((questionId) =>
                <ImageCell
                    key={questionId}
                    questionId={questionId}
                />
            )}
        </div>
    );
}

