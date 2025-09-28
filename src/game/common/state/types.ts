import type { GameOptions } from "src/gameOptions";
import type { GameStoreActions } from "./actionFactory";

export interface GameStore extends GameStoreActions {
    /** Current state of the game */
    state: GameState;
    /** Timestamps, at which the game was either paused or unpaused.
     *  When the game is...
     *   - paused or finished, the array should contain an even amount of entries.
     *   - unpaused, the array should contain an odd amount of entries.
     *   - unstarted or starting, the array should be empty. */
    timestamps: number[];
    options: GameOptions;
    /** Stores the ids of all the questions that are going to be presented in this game.
     *  Also determines the order in which the questions appear on screen. */
    questionIds: string[];
    /** Stores the states of all the questions that are going to be presented in this game. */
    questions: Record<string, Question | undefined>;
    /** Stores the ids of all the answers. */
    answerIds: string[];
    /** Stores all the answers to all questions. */
    answers: Record<string, Answer | undefined>;
}

export type GameState = "unpaused" | "paused" | "finished";

export class QuestionNotFoundError extends Error {
    name = "QuestionNotFoundError";

    constructor(...ids: string[]) {
        super("A question with the specified id could not be found. Ids were: " + ids.join(", "));
    }
}

export interface Question {
    /** A UUID. */
    id: string;
    /** Id of the administrative unit this question is about. */
    about: string;
    /** Contains either text or the URL of an image to be shown when this question is presented. */
    value: string;
    /** The amount of times the player has attempted to answer this question. */
    tries: number;
    /** A list of ids of answers to this question. */
    answerIds: string[];
}

export class AnswerNotFoundError extends Error {
    name = "AnswerNotFoundError";

    constructor(...ids: string[]) {
        super("An answer with the specified id could not be found. Ids were: " + ids.join(", "));
    }
}

export interface Answer {
    /** A UUID */
    id: string;
    /** The id of the question this is an answer to. */
    questionId: string;
    /** Id of the administrative unit this answer is about. */
    about: string;
    /** Contains either text or the URL of an image to be shown when this answer is presented. */
    value: string;
    correct: boolean;
}
