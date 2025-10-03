import { useContext } from "react";
import { QuestionNotFoundError } from "src/game/common";
import { DnDGameStoreContext } from "../../storeContext";
import { CellSlot } from "./CellSlot";

export interface ImageCellProps {
    questionId: string;
}

export function ImageCell({ questionId }: ImageCellProps) {
    const useDnDGameStore = useContext(DnDGameStoreContext);

    const question = useDnDGameStore((state) => state.questions[questionId]);
    if (!question)
        throw new QuestionNotFoundError(questionId);

    return (
        <div className="bg-white dark:bg-gray-90 rounded-[15px] p-[10px] pt-[15px] flex flex-col gap-[15px]">
            <img
                className="aspect-3/2"
                src={question.value}
            />

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
