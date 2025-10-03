import { useContext, useMemo } from "react";
import { DnDGameStoreContext } from "../storeContext";
import { Cell } from "./cell";

export function Table() {
    const useDnDGameStore = useContext(DnDGameStoreContext);

    const questionIds = useDnDGameStore((state) => state.questionIds);
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
                    <Cell
                        key={questionId}
                        questionId={questionId}
                    />
                )}
            </div>

            <div className="flex flex-col gap-[10px]">
                {secondHalf.map((questionId) =>
                    <Cell
                        key={questionId}
                        questionId={questionId}
                    />
                )}
            </div>
        </div>
    );
}
