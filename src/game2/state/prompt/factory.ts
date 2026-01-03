import {
    AnswerNotFoundError,
    createGameStore,
    QuestionNotFoundError,
    type Answer,
    type Answers,
    type GameAPIOptions,
    type Questions,
} from "src/game2/api";
import { unitsFromOptions, type GameOptions } from "src/gameOptions";
import type { ZustandGetter, ZustandHook, ZustandSetter } from "src/utils/zustand";
import { ulid } from "ulid";
import {
    PromptScreenNotFoundError,
    type FinalPromptScreen,
    type PromptGameActions,
    type PromptGameStore,
    type PromptScreen,
    type PromptScreens,
} from "./types";

/** Creates a game store based on the provided options.
 *  Assumes that options have been validated. */
export async function createPromptGameStore(
    options: GameOptions,
    onRestart: () => void,
): Promise<ZustandHook<PromptGameStore>> {
    const [units, allUnits] = await unitsFromOptions(options);
    const apiOptions: GameAPIOptions = {
        units,
        allUnits,
        guessFrom: options.guessFrom,
        guess: options.guess,
        provideHints: true,
        onRestart,
    };
    return createGameStore(apiOptions, (set, get, qsAndAs) => {
        const screensAndButtons = createScreens(qsAndAs);
        return {
            type: "prompt",
            ...screensAndButtons,
            ...createPromptGameActions(set, get),
            currentScreenId: screensAndButtons.screenIds[0],
        };
    });
}

/** Creates screens based on the questions and answers received from the game API. */
function createScreens(qsAndAs: Questions & Answers): PromptScreens {
    const result: PromptScreens = {
        screens: {},
        screenIds: [],
    };

    for (let questionIndex = 0; questionIndex < qsAndAs.questionIds.length; questionIndex++) {
        const questionId = qsAndAs.questionIds[questionIndex];
        const question = qsAndAs.questions[questionId];
        if (!question)
            throw new QuestionNotFoundError(questionId);

        const screen: PromptScreen = {
            id: ulid(),
            questionId,
            guesses: [],
        };
        result.screens[screen.id] = screen;
        result.screenIds.push(screen.id);
    }

    const finalScreen: FinalPromptScreen = {
        id: ulid(),
        final: true,
    };
    result.screens[finalScreen.id] = finalScreen;
    result.screenIds.push(finalScreen.id);

    return result;
}

function createPromptGameActions(
    set: ZustandSetter<PromptGameStore>,
    get: ZustandGetter<PromptGameStore>,
): PromptGameActions {
    function guess(text: string): ["correct" | "alreadyGuessed" | "wrong", string | null] {
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
            const hint = get().api.incorrectGuess(currentScreen.questionId);
            return ["wrong", hint];
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

            if (answer.content.text.toLowerCase() === text.toLowerCase()
                || answer.content.shortText.toLowerCase() === text.toLowerCase()) {
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
            throw new Error("Cannot record a guess on a final screen.");

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
        set({
            currentScreenId: screenId,
        });
    }

    return { guess, switchScreens };
}
