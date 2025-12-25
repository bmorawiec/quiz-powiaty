import type { WithAPI } from "src/game2/api";

export type ChoiceGameStore = ChoiceGameState & ChoiceGameActions & WithAPI;

export interface ChoiceGameState extends ChoiceScreens, Buttons {
    type: "choice";
    /** The id of the currently selected screen. */
    currentScreenId: string | "finishScreen";
}

export interface ChoiceGameActions {
    guess(buttonId: string): "correct" | "wrong";
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
    id: string;
    final?: false;
    state: "correct" | "incorrect" | "answering" | "unanswered";
    questionId: string;
    buttonIds: string[];
}

export interface FinalChoiceScreen {
    id: string;
    final: true;
    reached: boolean;
}

export interface Button {
    id: string;
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
