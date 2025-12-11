import type { WithAPI } from "src/game2/api";

export type DnDGameStore = DnDGameState & DnDGameActions & WithAPI;

export interface DnDGameState extends Cells, Cards {
    type: "dnd";
    unusedCardIds: string[];
}

export interface DnDGameActions {
    verify(buttonId: string): void;
    moveCardToSlot(cardId: string, questionId: string, slotIndex: number): void;
    moveCardToSidebar(cardId: string, beforeIndex?: number): void;
}

export interface Cells {
    cells: Record<string, Cell | undefined>;
    cellIds: string[];
}

export interface Cards {
    cards: Record<string, Card | undefined>;
    cardIds: string[];
}

export interface Cell {
    id: string;
    questionId: string;
    cardSlots: (string | null)[];
}

export interface Card {
    id: string;
    answerId: string;
    cellId: string | null;
    slotIndex: number;
    status: "correct" | "wrong" | null;
}

export class CellNotFoundError extends Error {
    name = "CellNotFoundError";

    constructor(id: string) {
        super("A cell with the specified id could not be found. Id was: " + id);
    }
}

export class CardNotFoundError extends Error {
    name = "CardNotFoundError";

    constructor(id: string) {
        super("A card with the specified id could not be found. Id was: " + id);
    }
}
