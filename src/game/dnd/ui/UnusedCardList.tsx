import { useContext, type DragEvent } from "react";
import { DnDGameStoreContext } from "../storeContext";
import { Card } from "./Card";

export function UnusedCardList() {
    const useDnDGameStore = useContext(DnDGameStoreContext);
    const unusedCardIds = useDnDGameStore((game) => game.unusedCardIds);

    const handleDragOver = (event: DragEvent) => {
        event.preventDefault();
    };

    const moveCardToSidebar = useDnDGameStore((game) => game.moveCardToSidebar);
    const handleDrop = (event: DragEvent) => {
        const cardId = event.dataTransfer.getData("QuizPowiaty.cardId");
        if (cardId !== "") {
            moveCardToSidebar(cardId);
        }
    };

    return (
        <div
            className="px-[20px] pb-[200px] grid grid-cols-2 gap-[10px]"
            onDragOver={handleDragOver}
            onDrop={handleDrop}
        >
            {unusedCardIds.map((cardId, index) =>
                <Card
                    key={cardId}
                    cardId={cardId}
                    indexInSidebar={index}
                />
            )}
        </div>
    );
}
