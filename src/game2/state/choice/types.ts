import type { WithAPI } from "src/game2/api";

export type ChoiceGameStore = ChoiceGameState & ChoiceGameActions & WithAPI;

export interface ChoiceGameState extends ChoiceScreens, Buttons {
    type: "choice";
    /** The id of the currently selected screen. */
    currentScreenId: string | "finishScreen";
}

export interface ChoiceGameActions {
    /** Checks if the clicked button corresponds to a correct answer. */
    guess(buttonId: string): "correct" | "wrong";

    /** Changes the currently selected screen. */
    switchScreens(screenId: string | "finishScreen"): void;
}

export interface ChoiceScreens {
    screens: Record<string, ChoiceScreen | FinalChoiceScreen | undefined>;
    screenIds: string[];
}

export interface Buttons {
    buttons: Record<string, Button | undefined>;
    buttonIds: string[];
}

export interface ChoiceScreen {
    /** A UUID. */
    id: string;
    /** Used to distinguish between normal screens and the final screen. Omit. */
    final?: false;
    /** Id of the question associated with this screen. */
    questionId: string;
    /** Ids of buttons to be shown on this screen. */
    buttonIds: string[];
}

export interface FinalChoiceScreen {
    /** A UUID. */
    id: string;
    /** Used to distinguish between normal screens and the final screen. */
    final: true;
}

export interface Button {
    /** A UUID. */
    id: string;
    /** Id of the button associated with this button. */
    answerId: string;
}

export class ChoiceScreenNotFoundError extends Error {
    name = "ChoiceScreenNotFoundError";

    constructor(id: string) {
        super("A screen with the specified id could not be found. Id was: " + id);
    }
}

export class ButtonNotFoundError extends Error {
    name = "ButtonNotFoundError";

    constructor(id: string) {
        super("A button with the specified id could not be found. Id was: " + id);
    }
}
