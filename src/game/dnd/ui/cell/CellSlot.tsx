import { Card } from "../Card";
import { EmptySlot } from "./EmptySlot";

export interface CellSlot {
    questionId: string;
    slotIndex: number;
    cardId: string | null;
}

export function CellSlot({ questionId, slotIndex, cardId }: CellSlot) {
    if (cardId) {
        return (
            <Card
                cardId={cardId}
            />
        );
    } else {
        return (
            <EmptySlot
                questionId={questionId}
                slotIndex={slotIndex}
            />
        );
    }
}
