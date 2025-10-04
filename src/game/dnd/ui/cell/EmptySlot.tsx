import { useContext, useState, type DragEvent } from "react";
import { DnDGameStoreContext } from "../../storeContext";
import clsx from "clsx";

export interface EmptySlotProps {
    questionId: string;
    slotIndex: number;
}

export function EmptySlot({ questionId, slotIndex }: EmptySlotProps) {
    const useDnDGameStore = useContext(DnDGameStoreContext);

    const [dragHover, setDragHover] = useState(false);

    const handleDragEnter = () => {
        setDragHover(true);
    };

    const handleDragLeave = () => {
        setDragHover(false);
    };

    const handleDragOver = (event: DragEvent) => {
        event.preventDefault();
    };

    const moveCardToSlot = useDnDGameStore((game) => game.moveCardToSlot);
    const handleDrop = (event: DragEvent) => {
        const cardId = event.dataTransfer.getData("QuizPowiaty.cardId");
        if (cardId !== "") {
            moveCardToSlot(cardId, questionId, slotIndex);
        }
    };

    return (
        <div
            className={clsx("h-[38px] border border-[2px] border-dotted rounded-[6px]",
                "border-gray-25 dark:border-gray-60", dragHover && "bg-gray-5 dark:bg-gray-85")}
            onDragEnter={handleDragEnter}
            onDragLeave={handleDragLeave}
            onDragOver={handleDragOver}
            onDrop={handleDrop}
        />
    );
}
