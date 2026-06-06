import clsx from "clsx";
import { useContext, useState } from "react";
import { AnswerNotFoundError } from "src/game2/questions";
import { CardNotFoundError } from "src/game2/state";
import { ApplyIcon, CloseIcon } from "src/ui";
import { DnDGameStoreContext } from "../hook";
import { CardContentView } from "./CardContentView";

export interface CardViewProps {
    cardId: string;
    /** If this card is rendered in the sidebar, then this should be set to its index in the list of cards
     *  shown. */
    indexInSidebar?: number;
}

/** Renders a card.
 *  Cards can be dragged & dropped over this card. Dragged cards will swap places with this card. */
export function CardView({ cardId, indexInSidebar }: CardViewProps) {
    const useDnDGameStore = useContext(DnDGameStoreContext);

    const card = useDnDGameStore((game) => game.cards[cardId]);
    if (!card) throw new CardNotFoundError(cardId);

    const answer = useDnDGameStore((game) => game.api.answers[card.answerId]);
    if (!answer) throw new AnswerNotFoundError(card.answerId);

    // true if this card is currently being dragged
    const [beingDragged, setBeingDragged] = useState(false);

    const handleDragStart = (event: React.DragEvent) => {
        event.dataTransfer.clearData();
        if (answer.content.type === "text") {
            // this is so that you can drop the card into a text area
            event.dataTransfer.setData("text/plain", answer.content.text);
        }
        event.dataTransfer.setData("QuizPowiaty.cardId", cardId);
        setBeingDragged(true);
    };

    // true if this card is hovered while another card is being dragged
    const [dragHover, setDragHover] = useState(false);

    const handleDragEnter = (event: React.DragEvent) => {
        event.stopPropagation();
    };

    const handleDragOver = (event: React.DragEvent) => {
        setDragHover(true);
        event.preventDefault();
    };

    const handleDragLeave = (event: React.DragEvent) => {
        event.stopPropagation();
        setDragHover(false);
    };

    const handleDragEnd = () => {
        setBeingDragged(false);
    };

    const moveCardToSlot = useDnDGameStore((game) => game.moveCardToSlot);
    const moveCardToSidebar = useDnDGameStore((game) => game.moveCardToSidebar);
    const handleDrop = (event: React.DragEvent) => {
        event.stopPropagation();

        setDragHover(false);

        // swapping with verified cards is not allowed
        if (card.status !== "correct") {
            const draggedCardId = event.dataTransfer.getData("QuizPowiaty.cardId");

            // check if data with this key exists
            // (an empty string would be returned if it didn't exist)
            if (draggedCardId !== "") {
                if (card.cellId) {  // this card is in a cell slot
                    // swap dragged card with this one
                    moveCardToSlot(draggedCardId, card.cellId, card.slotIndex);
                } else {    // this card is in the sidebar
                    // swap dragged card with this one by putting it in the sidebar
                    moveCardToSidebar(draggedCardId, indexInSidebar);
                }
            }
        }
    };

    const Icon = card.status && ((card.status === "correct") ? ApplyIcon : CloseIcon);

    return (
        <div
            className={clsx(card.cellId === null && "px-[20px] py-[5px]")}
            draggable={card.status !== "correct"}   // dragging verified cards is not allowed
            onDragStart={handleDragStart}
            onDragEnter={handleDragEnter}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDragEnd={handleDragEnd}
            onDrop={handleDrop}
        >
            <div
                className={clsx("border rounded-[10px] cursor-move text-[14px] shrink-0",
                    "transition-colors duration-40 cursor-move flex items-center gap-[5px]",
                    "border-gray-20 dark:border-gray-75",
                    (beingDragged)
                        ? "opacity-60"
                        : (dragHover)
                            ? "bg-gray-5 dark:bg-gray-85"
                            : "bg-white dark:bg-gray-90 hover:bg-gray-5 dark:hover:bg-gray-85",
                    (card.status) ? "pr-[12px]" : "pr-[31px]",
                    card.status && (
                        (card.status === "correct")
                            ? "text-teal-80 dark:text-teal-40"
                            : "text-red-60 dark:text-red-30"
                    ))}
            >
                <CardContentView content={answer.content}/>

                {Icon && (
                    <Icon className="size-[14px] shrink-0"/>
                )}
            </div>
        </div>
    );
}
