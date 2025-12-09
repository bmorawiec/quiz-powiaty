import type { WithAPI } from "src/game2/api";

export type DnDGameStore = DnDGameState & DnDGameActions & WithAPI;

export interface DnDGameState {
    type: "dnd";

    cells: Record<string, Cell | undefined>;
    cellIds: string[];

    cards: Record<string, Card | undefined>;
    cardIds: string[];
    unusedCardIds: string[];
}

export interface DnDGameActions {
    verify(buttonId: string): void;
    moveCardToSlot(cardId: string, questionId: string, slotIndex: number): void;
    moveCardToSidebar(cardId: string, beforeIndex?: number): void;
}

export interface Cell {
    id: string;
    questionId: string;
    cardSlots: string[];
}

export interface Card {
    id: string;
    answerId: string;
}
