import { useContext } from "react";
import { QuestionNotFoundError } from "src/game2/api";
import { CellNotFoundError } from "src/game2/state";
import { DnDGameStoreContext } from "../hook";
import { Slot } from "./Slot";

export interface CellViewProps {
    cellId: string;
}

/** Shows a cell. A single cell corresponds to a question. */
export function CellView({ cellId }: CellViewProps) {
    const useDnDGameStore = useContext(DnDGameStoreContext);

    const cell = useDnDGameStore((game) => game.cells[cellId]);
    if (!cell) throw new CellNotFoundError(cellId);

    const question = useDnDGameStore((game) => game.api.questions[cell.questionId]);
    if (!question)
        throw new QuestionNotFoundError(cell.questionId);
    if (question.content.type !== "text")
        throw new Error("Unexpected question content type: " + question.content.type);

    return (
        <div className="bg-white dark:bg-gray-90 rounded-[15px] p-[10px] grid grid-cols-2">
            <p className="text-[14px] tracking-[0.01em] ml-[6px] mt-[8px] mr-[10px]">
                {question.content.shortText}
            </p>

            <div className="flex flex-col gap-[6px]">
                {cell.cardSlots.map((cardId, index) =>
                    <Slot
                        key={index}
                        cardId={cardId}
                        cellId={cellId}
                        slotIndex={index}
                    />
                )}
            </div>
        </div>
    )
}
