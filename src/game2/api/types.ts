import type { Answers, Questions } from "../questions";

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

    /** Number of points awarded to the player.
     *  Updated after each correct guess. */
    points: number;
    /** The amount of points that can be received. */
    maxPoints: number;
}

export interface GameAPIActions {
    /** Pauses the game if it's currently unpaused. Unpauses the game if it's currently paused.
      * @throws if the game has finished */
    togglePause(): void;

    /** Calculates the time the game has been unpaused for. */
    calculateTime(): number;

    /** Restarts the game (calls the `onRestart` callback provided through API options). */
    restart(): void;

    /** Enters or exits fullscreen mode (calls the `onToggleFullscreen` callback provided through API options). */
    toggleFullscreen(): void;

    /** Used to report a correct guess.
     *  Marks the specified answer as guessed.
     *  @returns true if all the answers to this question have been guessed.
     *  @throws if the game has been paused or if it has finished */
    correctGuess(answerId: string): boolean;

    /** Used to report an incorrect guess.
     *  @throws if the game has been paused or if it has finished */
    incorrectGuess(questionId: string): void;

    /** Preloads images for the question and its answers (if there are any). */
    preloadImages(questionId: string): Promise<void>;
}

export type GameState = "unpaused" | "paused" | "finished";

export interface GameAPIOptions extends GameAPICallbacks {
    /** The questions that will be presented in this game. */
    questionsAndAnswers: Questions & Answers;
    /** Causes the API to preload all question and answer images.
     *  Normally only images for the first two questions are preloaded.
     *  @default false */
    preloadAllImages?: boolean;
}

export interface GameAPICallbacks {
    onRestart: () => void;
    /** Called when the user clicks the 'fullscreen' button or 'exit fullscreen' button. */
    onToggleFullscreen: () => void;
}
