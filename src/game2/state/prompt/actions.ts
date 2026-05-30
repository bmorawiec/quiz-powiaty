import { AnswerNotFoundError, QuestionNotFoundError, type Answer } from "src/game2/questions";
import type { ZustandGetter, ZustandSetter } from "src/utils/zustand";
import { PromptScreenNotFoundError, type PromptGameActions, type PromptGameStore, type PromptScreen } from "./types";

/** Returns all actions used by this game store. */
export function createAllActions(set: ZustandSetter<PromptGameStore>, get: ZustandGetter<PromptGameStore>) {
    function guess(text: string): ["correct" | "alreadyGuessed" | "wrong", string | null] {
        if (get().api.state !== "unpaused")
            throw new Error("Cannot perform this action while the game is paused or finished.");

        const currentScreenId = get().currentScreenId;
        const currentScreen = get().screens[currentScreenId];
        if (!currentScreen)
            throw new PromptScreenNotFoundError(currentScreenId);
        if (currentScreen.final)
            throw new Error("Cannot provide answers while the final screen is selected.");

        const answer = getMatchingAnswer(currentScreen, text);
        if (answer) {
            if (answer.guessed) {
                return ["alreadyGuessed", null];
            } else {
                recordGuess(text, true);
                const allAnswersGuessed = get().api.correctGuess(answer.id);
                if (allAnswersGuessed) {
                    nextScreen();
                }
                return ["correct", null];
            }
        } else {
            recordGuess(text, false);
            get().api.incorrectGuess(currentScreen.questionId);
            return ["wrong", "TODO"];
        }
    }

    /** Returns the answer that contains the provided text.
     *  Returns null if such an answer couldn't be found. */
    function getMatchingAnswer(screen: PromptScreen, text: string): Answer | null {
        const question = get().api.questions[screen.questionId];
        if (!question) throw new QuestionNotFoundError(screen.questionId);

        for (const answerId of question.answerIds) {
            const answer = get().api.answers[answerId];
            if (!answer)
                throw new AnswerNotFoundError(answerId);
            if (answer.content.type !== "text")
                throw new Error("Expected content to be of type 'text'.");

            if (answer.content.text.toLowerCase() === text.toLowerCase()) {
                return answer;
            }
        }
        return null;
    }

    function recordGuess(text: string, correct: boolean) {
        const currentScreenId = get().currentScreenId;
        const currentScreen = get().screens[currentScreenId];
        if (!currentScreen)
            throw new PromptScreenNotFoundError(currentScreenId);
        if (currentScreen.final)
            throw new Error("Cannot record a guess on the final screen.");

        set((game) => ({
            screens: {
                ...game.screens,
                [currentScreenId]: {
                    ...currentScreen,
                    guesses: [
                        ...currentScreen.guesses,
                        { text, correct },
                    ],
                },
            },
        }));
    }

    /** Proceeds to the next screen.
     *  Preloads images for the next-next screen, if there are any to load. */
    function nextScreen() {
        if (get().currentScreenId === get().screenIds.at(-1))
            throw new Error("This action cannot be performed when on the final screen.");

        const nextNextScreenId = get().screenIds[get().api.numberGuessed + 1];
        if (nextNextScreenId) {
            const nextNextScreen = get().screens[nextNextScreenId];
            if (!nextNextScreen)
                throw new PromptScreenNotFoundError(nextNextScreenId);

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

    return { guess, getMatchingAnswer, recordGuess, nextScreen, switchScreens };
}

/** Returns only the actions that are exposed by this game store. */
export function getPublicActions(
    set: ZustandSetter<PromptGameStore>,
    get: ZustandGetter<PromptGameStore>,
): PromptGameActions {
    const { guess, switchScreens } = createAllActions(set, get);
    return { guess, switchScreens };
}
