import type { Guessable, Unit } from "src/data/common";

export interface WithAPI {
    api: GameAPI;
}

export type GameAPI = GameAPIState & GameAPIActions;

export interface GameAPIState extends Questions, Answers {
    /** Current state of the game */
    state: GameState;
    /** Timestamps, at which the game was either paused or unpaused.
     *  When the game is...
     *   - paused or finished, the array should contain an even amount of entries.
     *   - unpaused, the array should contain an odd amount of entries.
     *   - unstarted or starting, the array should be empty. */
    timestamps: number[];

    /** The configuration this instance of the game API was created with. */
    options: GameAPIOptions;

    /** Number of guessed questions. */
    numberGuessed: number;
}

export interface GameAPIActions {
    /** Pauses the game if it's currently unpaused. Unpauses the game if it's currently paused.
      * @throws if the game has been finished */
    togglePause(): void;

    /** Calculates the time the game has unpaused for. */
    calculateTime(): number;

    /** Used to report a correct guess.
     *  Marks the specified answer as guessed.
     *  @returns true if all the answers to this question have been guessed. */
    correctGuess(answerId: string): boolean;

    /** Used to report an incorrect guess.
     *  @returns a hint if configured to do so, and if the number of guesses exceeds four. */
    incorrectGuess(questionId: string): string | null;
}

export type GameState = "unpaused" | "paused" | "finished";

export interface Questions {
    questions: Record<string, Question | undefined>;
    questionIds: string[];
}

export interface Answers {
    answers: Record<string, Answer | undefined>;
    answerIds: string[];
}

export interface GameAPIOptions {
    /** Units to generate questions about. */
    units: Unit[];
    /** This type of data will be used to generate questions. */
    guessFrom: Guessable;
    /** This type of data will be used to generate answers. */
    guess: Guessable;
    /** Add incorrect, but plausible answers to each question.
     *  @default false */
    providePlausibleAnswers?: boolean;
    /** Provide hints as a result of a call to the `incorrectGuess` action.
     *  @default false */
    provideHints?: boolean;
    /** Sort the questionIds field, so that questions appear in alphabetical order. */
    sortQuestions?: boolean;
    /** Causes the API to preload all question and answer images.
     *  Normally only images for the first two questions are preloaded. */
    preloadAllImages?: boolean;
}

export interface Question {
    /** A UUID. */
    id: string;
    /** Id of the administrative unit this question is about. */
    unitId: string;
    text: string;
    shortText: string;
    imageURL: string;
    /** The amount of points awarded for this question.
     *  4 by default. Decreases with each incorrect guess. */
    points: number;
    /** Number of incorrect tries when guessing this question. */
    tries: number;
    /** Ids of the answers to this question. */
    answerIds: string[];
    /** Number of guessed answers. */
    numberGuessed: number;
    /** Number of correct answers. */
    numberCorrect: number;
    /** If true, then all the answers to this question have been correctly guessed. */
    guessed: boolean;
}

export interface Answer {
    /** A UUID. */
    id: string;
    /** Id of the question this is an answer to. */
    questionId: string;
    /** Id of the administrative unit this answer is about. */
    unitId: string;
    text: string;
    shortText: string;
    imageURL: string;
    /** Whether or not this is a correct answer. */
    correct: boolean;
    /** If true, then this answer has been correctly guessed. */
    guessed: boolean;
}

export class QuestionNotFoundError extends Error {
    name = "QuestionNotFoundError";

    constructor(id: string) {
        super("A question with the specified id could not be found. Id was: " + id);
    }
}

export class AnswerNotFoundError extends Error {
    name = "AnswerNotFoundError";

    constructor(id: string) {
        super("An answer with the specified id could not be found. Id was: " + id);
    }
}
