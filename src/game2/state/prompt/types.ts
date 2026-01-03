import type { WithAPI } from "src/game2/api";

export type PromptGameStore = PromptGameState & PromptGameActions & WithAPI;

export interface PromptGameState extends PromptScreens {
    type: "prompt";
    /** The id of the currently selected screen. */
    currentScreenId: string | "finishScreen";
}

export interface PromptGameActions {
    /** Verifies a text answer provided by the player.
     *  @returns a tuple containing the result of this guess and a hint. */
    guess(text: string): ["correct" | "alreadyGuessed" | "wrong", string | null];

    /** Changes the currently selected screen. */
    switchScreens(screenId: string | "finishScreen"): void;
}

export interface PromptScreens {
    screens: Record<string, PromptScreen | FinalPromptScreen | undefined>;
    screenIds: string[];
}

export interface PromptScreen {
    /** A UUID. */
    id: string;
    /** Used to distinguish between normal screens and the final screen. Omit. */
    final?: false;
    /** Id of the question associated with this screen. */
    questionId: string;
    /** A list of guesses made by the player. */
    guesses: Guess[];
}

export interface Guess {
    text: string;
    correct: boolean;
}

export interface FinalPromptScreen {
    /** A UUID. */
    id: string;
    /** Used to distinguish between normal screens and the final screen. */
    final: true;
}

export class PromptScreenNotFoundError extends Error {
    name = "PromptScreenNotFoundError";

    constructor(id: string) {
        super("A screen with the specified id could not be found. Id was: " + id);
    }
}
