import {
    AnswerNotFoundError,
    createGameStore,
    QuestionNotFoundError,
    type Answers,
    type GameAPIOptions,
    type Question,
    type Questions,
} from "src/game2/api";
import { unitsFromOptions, type GameOptions } from "src/gameOptions";
import type { ZustandGetter, ZustandHook, ZustandSetter } from "src/utils/zustand";
import { ulid } from "ulid";
import {
    ButtonNotFoundError,
    ChoiceScreenNotFoundError,
    type Button,
    type Buttons,
    type ChoiceGameActions,
    type ChoiceGameStore,
    type ChoiceScreen,
    type ChoiceScreens,
    type FinalChoiceScreen,
} from "./types";

/** Creates a game store based on the provided options.
 *  Assumes that options have been validated. */
export async function createChoiceGameStore(options: GameOptions): Promise<ZustandHook<ChoiceGameStore>> {
    const [units, allUnits] = await unitsFromOptions(options);
    const apiOptions: GameAPIOptions = {
        units,
        allUnits,
        guessFrom: options.guessFrom,
        guess: options.guess,
        squishAnswers: true,
        numberOfAnswers: 6,
    };
    return createGameStore(apiOptions, (set, get, qsAndAs) => {
        const screensAndButtons = createScreensAndButtons(qsAndAs);
        return {
            type: "choice",
            ...screensAndButtons,
            ...createChoiceGameActions(set, get),
            currentScreenId: screensAndButtons.screenIds[0],
        };
    });
}

/** Creates screens and buttons based on the questions and answers received from the game API. */
function createScreensAndButtons(qsAndAs: Questions & Answers): ChoiceScreens & Buttons {
    const result: ChoiceScreens & Buttons = {
        screens: {},
        screenIds: [],

        buttons: {},
        buttonIds: [],
    };

    for (let questionIndex = 0; questionIndex < qsAndAs.questionIds.length; questionIndex++) {
        const questionId = qsAndAs.questionIds[questionIndex];
        const question = qsAndAs.questions[questionId];
        if (!question)
            throw new QuestionNotFoundError(questionId);

        const { buttons, buttonIds } = createButtons(qsAndAs, question);
        result.buttons = { ...result.buttons, ...buttons };
        result.buttonIds.push(...buttonIds);

        const screen: ChoiceScreen = {
            id: ulid(),
            questionId,
            buttonIds,
        };
        result.screens[screen.id] = screen;
        result.screenIds.push(screen.id);
    }

    const finalScreen: FinalChoiceScreen = {
        id: ulid(),
        final: true,
    };
    result.screens[finalScreen.id] = finalScreen;
    result.screenIds.push(finalScreen.id);

    return result;
}

/** Creates buttons corresponding to the answers of the provided question. */
function createButtons(qsAndAs: Questions & Answers, question: Question): Buttons {
    const result: Buttons = {
        buttons: {},
        buttonIds: [],
    };

    for (const answerId of question.answerIds) {
        const answer = qsAndAs.answers[answerId];
        if (!answer)
            throw new AnswerNotFoundError(answerId);

        const button: Button = {
            id: ulid(),
            answerId,
        };
        result.buttons[button.id] = button;
        result.buttonIds.push(button.id);
    }

    return result;
}

function createChoiceGameActions(
    set: ZustandSetter<ChoiceGameStore>,
    get: ZustandGetter<ChoiceGameStore>,
): ChoiceGameActions {
    function guess(buttonId: string) {
        const button = get().buttons[buttonId];
        if (!button) throw new ButtonNotFoundError(buttonId);

        const answer = get().api.answers[button.answerId];
        if (!answer) throw new AnswerNotFoundError(button.answerId);

        if (answer.correct) {
            get().api.correctGuess(button.answerId);
            nextScreen();
            return "correct";
        } else {
            get().api.incorrectGuess(answer.questionId);
            return "wrong";
        }
    }

    /** Proceeds to the next screen.
     *  Preloads images for the next-next screen, if there are any to load. */
    function nextScreen() {
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
        set({
            currentScreenId: screenId,
        });
    }

    return { guess, switchScreens };
}
