import type { WithAPI } from "src/game2/api";

export type ChoiceGameStore = ChoiceGameState & ChoiceGameActions & WithAPI;

export interface ChoiceGameState {
    type: "choice";

    screens: Record<string, ChoiceScreen | undefined>;
    screenIds: string[];

    buttons: Record<string, Button | undefined>;
    buttonIds: string[];
}

export interface ChoiceGameActions {
    guess(buttonId: string): "correct" | "wrong";
}

export interface ChoiceScreen {
    id: string;
    questionId: string;
    choiceIds: string[];
}

export interface Button {
    id: string;
    answerId: string;
}
