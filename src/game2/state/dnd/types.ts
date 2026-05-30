import type { WithAPI } from "src/game2/api";
import type { GameOptions } from "src/game2/options";

export type DnDGameStore = DnDGameState & DnDGameActions & WithAPI;

export interface DnDGameState extends Cells, Cards {
    type: "dnd";
    options: GameOptions;
    /** Ids of cards that haven't been placed in any slot. These should be rendered in the sidebar. */
    unusedCardIds: string[];
}

export interface DnDGameActions {
    /** Checks if all cards have been placed in the correct slots.
     *  Updates the status of correctly placed cards. Finishes the game when all cards have been placed correctly.
     *  @throws if the game is paused or finished. */
    verify(): void;
    /** Moves the specified card into a slot.
     *  If the target slot already has a card in it, then the cards will be swapped.
     *  @throws if the game is paused or finished. */
    moveCardToSlot(cardId: string, cellId: string, slotIndex: number): void;
    /** Moves the specified card into the sidebar, placing it before the specified index.
     *  If the index is not specified, then the card is placed last.
     *  @throws if the game is paused or finished. */
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
    /** Contains ids of cards placed in the slots of this cell. A null entry corresponds to an empty slot.
     *  The length of this array corresponds to the number of slots (no of correct answers to this question). */
    cardSlots: (string | null)[];
}

export interface Card {
    id: string;
    answerId: string;
    /** Id of the parent cell of the slot this card is in. */
    cellId: string | null;
    /** Index of the slot this card is in. -1 if the card is not in any slot. */
    slotIndex: number;
    /** null - the card hasn't been verified yet
    /*  "correct" - this card has been placed in the right slot
     *  "wrong" - this card has been placed in the wrong slot */
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
