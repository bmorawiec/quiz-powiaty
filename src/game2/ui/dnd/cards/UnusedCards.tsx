import { useContext } from "react";
import { DnDGameStoreContext } from "../hook";
import { CardView } from "./CardView";

/** Shows a list of all the cards that haven't been placed in any slot. */
export function UnusedCards() {
    const useDnDGameStore = useContext(DnDGameStoreContext);
    const unusedCardIds = useDnDGameStore((game) => game.unusedCardIds);

    return (
        <div className="size-full overflow-y-auto p-[20px] flex flex-col gap-[10px]
            scrollbar-color thumb-color-gray-25 track-color-gray-10">
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
