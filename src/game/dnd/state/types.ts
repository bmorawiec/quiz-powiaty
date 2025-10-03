import type { Answer, GameStore, Question } from "src/game/common";
import type { StoreApi, UseBoundStore } from "zustand";
import type { DnDGameStoreActions } from "./actionFactory";

export type DnDGameStoreHook = UseBoundStore<StoreApi<DnDGameStore>>;

export interface DnDGameStore extends GameStore, DnDGameStoreActions {
    questions: Record<string, DnDQuestion | undefined>;
    answers: Record<string, DnDAnswer | undefined>;
    /** The title text shown on the game screen. */
    title: string;
    /** Stores the states of all cards. */
    cards: Record<string, DnDCard | undefined>;
    /** Stores ids of unused cards. These appear in the sidebar. */
    unusedCardIds: string[];
}

export interface DnDQuestion extends Question {
    /** Keeps track of which cards are in what slots.
     *  Each entry in the array corresponds to a slot. Null entries correspond to empty slots. */
    cardIds: (string | null)[];
}

export type DnDAnswer = Answer;

export class CardNotFoundError extends Error {
    name = "CardNotFoundError";

    constructor(...ids: string[]) {
        super("A card with the specified id could not be found. Ids were: " + ids.join(", "));
    }
}

/** Stores the state of a draggable card. */
export interface DnDCard {
    /** A UUID. Same as the id of a matching answer. */
    id: string;
    /** Id of the parent question of the slot this card is currently in.
     *  Null if the card is in the sidebar. */
    questionId: string | null;
    /** Index of the slot this card is currently in.
     *  -1 if the card is in the sidebar. */
    slotIndex: number;
    /** Contains either text or the URL of an image to be shown on this card. */
    value: string;
    /** Result of the last call to the 'verify' action. */
    verificationResult: VerificationResult | null;
}

/** "correct" - the guess was correct.
 *  "wrong" - the guess was incorrect. */
export type VerificationResult = "correct" | "wrong";
