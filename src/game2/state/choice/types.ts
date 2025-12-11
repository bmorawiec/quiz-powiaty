import type { WithAPI } from "src/game2/api";

export type ChoiceGameStore = ChoiceGameState & ChoiceGameActions & WithAPI;

export interface ChoiceGameState extends ChoiceScreens, Buttons {
    type: "choice";
}

export interface ChoiceGameActions {
    guess(buttonId: string): "correct" | "wrong";
}

export interface ChoiceScreens {
    screens: Record<string, ChoiceScreen | undefined>;
    screenIds: string[];
}

export interface Buttons {
    buttons: Record<string, Button | undefined>;
    buttonIds: string[];
}

export interface ChoiceScreen {
    id: string;
    questionId: string;
    buttonIds: string[];
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
