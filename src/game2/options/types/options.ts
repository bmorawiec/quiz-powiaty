import type { GameFilters } from "./filters";

export interface GameOptions {
    mode: GameMode;
    /** Whether the questions are about voivodeships or counties. */
    unitType: UnitType;
    /** The property that the player will guess based on. */
    guessFrom: Guessable;
    /** The property that will be guessed by the player. */
    guess: Guessable;
    /** Maximum amount of questions in this game.
     *  If set to `Infinity`, then there won't be a question limit. */
    maxQuestions: number;
    /** Questions will be generated based on units that match these filters. */
    filters: GameFilters;
}

export type UnitType =
    | "county"
    | "voivodeship";

export type GameMode =
    | "choice"      /** A multiple choice quiz. */
    | "dnd"         /** Drag-and-drop answers to their respective questions. */
    | "prompt"      /** Type in answers to prompts one prompt at a time. */
    | "typing";     /** Fill in the table. */

export type Guessable =
    | "name"        /** Guess or guess from the name of an administrative unit. */
    | "capital"     /** Guess or guess from the capital of an administrative unit. */
    | "plate"       /** Guess or guess from the license plate code of an administrative unit. */
    | "flag"        /** Guess or guess from the flag of an administrative unit. */
    | "coa"         /** Guess or guess from the coat of arms of an administrative unit. */
    | "shape";      /** Guess or guess from the shape of an administrative unit. */
