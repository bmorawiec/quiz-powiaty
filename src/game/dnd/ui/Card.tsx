import clsx from "clsx";
import { useContext, useState, type DragEvent } from "react";
import { ApplyIcon, CloseIcon, DragHandleIcon } from "src/ui";
import { CardNotFoundError } from "../state";
import { DnDGameStoreContext } from "../storeContext";

export interface CardProps {
    cardId: string;
    indexInSidebar?: number;
}

export function Card({ cardId, indexInSidebar = -1 }: CardProps) {
    const useDnDGameStore = useContext(DnDGameStoreContext);
    const options = useDnDGameStore((game) => game.options);

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
            className={clsx("border rounded-[6px] cursor-move px-[9px] pt-[7px] pb-[8px] text-[14px]",
                "transition-colors duration-40 cursor-move flex",
                "border-gray-20 dark:border-gray-75",
                (beingDragged)
                    ? "opacity-60"
                    : (dragHover)
                        ? "bg-gray-5 dark:bg-gray-85"
                        : "bg-white dark:bg-gray-90 hover:bg-gray-5 dark:hover:bg-gray-85",
                card.verificationResult && (
                    (card.verificationResult === "correct")
                        ? "text-teal-80 dark:text-teal-40"
                        : "text-red-60 dark:text-red-30"
                ))}
            onDragStart={handleDragStart}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDragEnd={handleDragEnd}
            onDrop={handleDrop}
        >
            <DragHandleIcon
                className="size-[10px] mt-[6px] mr-[4px] text-gray-60 shrink-0"
            />

            {(options.guess === "flag" || options.guess === "coa") ? (
                <div
                    className="flex-1 h-[100px] bg-contain bg-center bg-no-repeat"
                    style={{
                        backgroundImage: `url(${card.value})`,
                    }}
                />
            ) : (
                <p>
                    {card.value}
                </p>
            )}

            {Icon && (
                <Icon className="ml-[4px] mt-[4px] size-[14px] shrink-0"/>
            )}
        </div>
    );
}
