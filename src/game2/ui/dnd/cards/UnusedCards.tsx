import clsx from "clsx";
import { useContext, useState } from "react";
import { DnDGameStoreContext } from "../hook";
import { CardView } from "./CardView";

/** Shows a list of all the cards that haven't been placed in any slot. */
export function UnusedCards() {
    const useDnDGameStore = useContext(DnDGameStoreContext);
    const unusedCardIds = useDnDGameStore((game) => game.unusedCardIds);

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

    const moveCardToSidebar = useDnDGameStore((game) => game.moveCardToSidebar);
    const handleDrop = (event: React.DragEvent) => {
        setDragHover(false);

        const draggedCardId = event.dataTransfer.getData("QuizPowiaty.cardId");

        // check if data with this key exists
        // (an empty string would be returned if it didn't exist)
        if (draggedCardId !== "") {
            moveCardToSidebar(draggedCardId);
        }
    };

    return (
        <div
            className={clsx("size-full overflow-y-auto flex flex-col pt-[15px] pb-[400px]",
                "scrollbar-color thumb-color-gray-25 track-color-gray-10",
                "dark:thumb-color-gray-70 dark:track-color-gray-90",
                dragHover && "bg-gray-15")}
            onDragEnter={handleDragEnter}
            onDragLeave={handleDragLeave}
            onDragOver={handleDragOver}
            onDrop={handleDrop}
        >
            {unusedCardIds.map((cardId, index) =>
                <CardView
                    key={cardId}
                    cardId={cardId}
                    indexInSidebar={index}
                />
            )}
        </div>
    );
}
