import React, { useContext, useState } from "react";
import { DnDGameStoreContext } from "../hook";
import clsx from "clsx";

export interface EmptySlotProps {
    cellId: string;
    slotIndex: number;
}

/** Renders an empty cell slot.
 *  Cards can be dragged & dropped into this slot. */
export function EmptySlot({ cellId, slotIndex }: EmptySlotProps) {
    const useDnDGameStore = useContext(DnDGameStoreContext);

    // true if hovered while a card is being dragged
    const [dragHover, setDragHover] = useState(false);

    const handleDragEnter = () => {
        setDragHover(true);
    };

    const handleDragLeave = () => {
        setDragHover(false);
    };

    const handleDragOver = (event: React.DragEvent) => {
        event.preventDefault();
    };

    const moveCardToSlot = useDnDGameStore((game) => game.moveCardToSlot);
    const handleDrop = (event: React.DragEvent) => {
        const draggedCardId = event.dataTransfer.getData("QuizPowiaty.cardId");

        // check if data with this key exists
        // (an empty string would be returned if it didn't exist)
        if (draggedCardId !== "") {
            moveCardToSlot(draggedCardId, cellId, slotIndex);
        }
    };

    return (
        <div
            className={clsx("h-[42px] border border-[2px] border-dotted rounded-[6px]",
                "border-gray-25 dark:border-gray-60", dragHover && "bg-gray-5 dark:bg-gray-85")}
            onDragEnter={handleDragEnter}
            onDragLeave={handleDragLeave}
            onDragOver={handleDragOver}
            onDrop={handleDrop}
        />
    );
}
