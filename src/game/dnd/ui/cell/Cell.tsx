import { useContext } from "react";
import { QuestionNotFoundError } from "src/game/common";
import { DnDGameStoreContext } from "../../storeContext";
import { CellSlot } from "./CellSlot";

export interface CellProps {
    questionId: string;
}

export function Cell({ questionId }: CellProps) {
    const useDnDGameStore = useContext(DnDGameStoreContext);

    const question = useDnDGameStore((state) => state.questions[questionId]);
    if (!question)
        throw new QuestionNotFoundError(questionId);

    return (
        <div className="bg-white dark:bg-gray-90 rounded-[15px] p-[10px] grid grid-cols-2">
            <p className="text-[14px] tracking-[0.01em] ml-[6px] mt-[8px] mr-[10px]">
                {question.value}
            </p>

            <div className="flex flex-col gap-[6px]">
                {question.cardIds.map((cardId, index) =>
                    <CellSlot
                        key={index}
                        questionId={questionId}
                        slotIndex={index}
                        cardId={cardId}
                    />
                )}
            </div>
        </div>
    );
}
