import { AnswerNotFoundError } from "src/game2/api";
import type { ZustandGetter, ZustandSetter } from "src/utils/zustand";
import {
    ButtonNotFoundError,
    ChoiceScreenNotFoundError,
    type ChoiceGameActions,
    type ChoiceGameStore,
} from "./types";

/** Returns all actions used by this game store. */
export function createAllActions(set: ZustandSetter<ChoiceGameStore>, get: ZustandGetter<ChoiceGameStore>) {
    function guess(buttonId: string) {
        if (get().api.state !== "unpaused")
            throw new Error("This action can only be performed while the game is unpaused.");

        const button = get().buttons[buttonId];
        if (!button) throw new ButtonNotFoundError(buttonId);

        const answer = get().api.answers[button.answerId];  // get answer corresponding to the clicked button
        if (!answer) throw new AnswerNotFoundError(button.answerId);

        if (answer.correct) {   // verify that it's the correct answer
            get().api.correctGuess(button.answerId);
            nextScreen();
            return "correct";
        } else {
            get().api.incorrectGuess(answer.questionId);
            return "wrong";
        }
    }

    /** Proceeds to the next screen.
     *  Preloads images for the next-next screen, if there are any to load.
     *  @throws when called while the results screen is shown. */
    function nextScreen() {
        if (get().currentScreenId === get().screenIds.at(-1))
            throw new Error("This action cannot be performed when on the final screen.");

        const nextNextScreenId = get().screenIds[get().api.numberGuessed + 1];
        if (nextNextScreenId) {
            const nextNextScreen = get().screens[nextNextScreenId];
            if (!nextNextScreen)
                throw new ChoiceScreenNotFoundError(nextNextScreenId);

            if (!nextNextScreen.final) {
                get().api.preloadImages(nextNextScreen.questionId);
            }
        }

        const nextScreenId = get().screenIds[get().api.numberGuessed];
        switchScreens(nextScreenId);
    }

    function switchScreens(screenId: string) {
        if (get().screenIds.indexOf(screenId) > get().api.numberGuessed)
            throw new Error("This action cannot be performed until all the questions before this one are answered.");

        set({
            currentScreenId: screenId,
        });
    }

    return { guess, nextScreen, switchScreens };
}

/** Returns only the actions that are exposed by this game store. */
export function getPublicActions(
    set: ZustandSetter<ChoiceGameStore>,
    get: ZustandGetter<ChoiceGameStore>,
): ChoiceGameActions {
    const { guess, switchScreens } = createAllActions(set, get);
    return { guess, switchScreens };
}
