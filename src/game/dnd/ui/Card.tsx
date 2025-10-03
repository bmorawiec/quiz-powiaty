import { useContext, useState, type DragEvent } from "react";
import { CardNotFoundError } from "../state";
import { DnDGameStoreContext } from "../storeContext";
import clsx from "clsx";
import { ApplyIcon, CloseIcon, DragHandleIcon } from "src/ui";

export interface CardProps {
    cardId: string;
    indexInSidebar?: number;
}

export function Card({ cardId, indexInSidebar = -1 }: CardProps) {
    const useDnDGameStore = useContext(DnDGameStoreContext);

    const card = useDnDGameStore((game) => game.cards[cardId]);
    if (!card)
        throw new CardNotFoundError(cardId);

    const [beingDragged, setBeingDragged] = useState(false);

    const handleDragStart = (event: DragEvent) => {
        event.dataTransfer.clearData();
        event.dataTransfer.setData("text/plain", card.value);
        event.dataTransfer.setData("QuizPowiaty.cardId", cardId);
        setBeingDragged(true);
    };

    const [dragHover, setDragHover] = useState(false);

    const handleDragOver = (event: DragEvent) => {
        setDragHover(true);
        event.stopPropagation();
        event.preventDefault();
    };

    const handleDragLeave = (event: DragEvent) => {
        if (event.target === event.currentTarget) {
            setDragHover(false);
        }
    };

    const handleDragEnd = () => {
        setBeingDragged(false);
    };

    const moveCardToSlot = useDnDGameStore((game) => game.moveCardToSlot);
    const moveCardToSidebar = useDnDGameStore((game) => game.moveCardToSidebar);
    const handleDrop = (event: DragEvent) => {
        event.stopPropagation();

        setDragHover(false);

        const cardId = event.dataTransfer.getData("QuizPowiaty.cardId");
        if (cardId !== "") {
            if (card.questionId) {
                moveCardToSlot(cardId, card.questionId, card.slotIndex);
            } else {
                moveCardToSidebar(cardId, indexInSidebar);
            }
        }
    };

    const Icon = card.verificationResult
        && ((card.verificationResult === "correct") ? ApplyIcon : CloseIcon);

    return (
        <div
            draggable
            className={clsx("border border-gray-20 rounded-[6px] cursor-move px-[9px] pt-[7px] pb-[8px] text-[14px]",
                "transition-colors duration-40 cursor-move flex",
                (beingDragged)
                    ? "opacity-60"
                    : (dragHover) ? "bg-gray-5" : "bg-white hover:bg-gray-5",
                card.verificationResult
                    && ((card.verificationResult === "correct") ? "text-teal-80" : "text-red-60"))}
            onDragStart={handleDragStart}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDragEnd={handleDragEnd}
            onDrop={handleDrop}
        >
            <DragHandleIcon
                className="size-[10px] mt-[6px] mr-[4px] text-gray-60"
            />

            <p>
                {card.value}
            </p>

            {Icon && (
                <Icon className="ml-[4px] mt-[4px] size-[14px]"/>
            )}
        </div>
    );
}
