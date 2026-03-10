import { EmptySlot } from "./EmptySlot";
import { CardView } from "../cards";

export interface SlotProps {
    /** Id of the card to be rendered inside the slot.
     *  If this is null, then an empty slot is shown. */
    cardId: string | null;
    cellId: string;
    slotIndex: number;
}

export function Slot({ cardId, cellId, slotIndex }: SlotProps) {
    if (cardId) {
        return <CardView cardId={cardId}/>;
    } else {
        return (
            <EmptySlot
                cellId={cellId}
                slotIndex={slotIndex}
            />
        );
    }
}
