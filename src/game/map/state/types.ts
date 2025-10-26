import type { StoreApi, UseBoundStore } from "zustand";
import type { Answer, GameStore, Question } from "../../common";
import type { MapGameStoreActions } from "./actionFactory";

export type MapGameStoreHook = UseBoundStore<StoreApi<MapGameStore>>;

export interface MapGameStore extends GameStore, MapGameStoreActions {
    questions: Record<string, MapQuestion | undefined>;
    answers: Record<string, MapAnswer | undefined>;
    /** Contains information about map features to be shown on the game screen. */
    features: Record<string, MapFeature | undefined>;
    featureIds: string[];
    /** The title text shown on the game screen. */
    title?: string;
    /** Id of the current question. */
    current: string;
    /** Total number of answered questions. */
    answered: number;
}

export interface MapQuestion extends Question {
    guessed: boolean;
}

export interface MapAnswer extends Answer {
    correct: true;
}

/** "correct" - the guess was correct.
 *  "wrong" - the guess was incorrect. */
export type GuessResult = "correct" | "wrong";

export class FeatureNotFoundError extends Error {
    name = "FeatureNotFoundError";

    constructor(id: string) {
        super("A feature with the specified id couldn't be found. Id was: " + id);
    }
}

/** Represents a feature to be shown on the map. */
export interface MapFeature {
    id: string;
    /** Id of the unit this feature corresponds to. */
    unitId: string;
    /** Id of the question this feature is an answer to. */
    questionId?: string;
}
