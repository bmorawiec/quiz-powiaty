import {
    AnswerNotFoundError,
    createGameStore,
    QuestionNotFoundError,
    type Answers,
    type GameAPICallbacks,
    type GameAPIOptions,
    type Question,
    type Questions,
} from "src/game2/api";
import { unitsFromOptions, type GameOptions } from "src/gameOptions";
import type { ZustandHook } from "src/utils/zustand";
import { ulid } from "ulid";
import {
    type Button,
    type Buttons,
    type ChoiceGameStore,
    type ChoiceScreen,
    type ChoiceScreens,
    type FinalChoiceScreen,
} from "./types";
import { getPublicActions } from "./actions";

/** Creates a game store based on the provided options.
 *  Assumes that options have been validated. */
export async function createChoiceGameStore(
    options: GameOptions,
    callbacks: GameAPICallbacks,
): Promise<ZustandHook<ChoiceGameStore>> {
    const [units, allUnits] = await unitsFromOptions(options);
    const apiOptions: GameAPIOptions = {
        units,
        allUnits,
        guessFrom: options.guessFrom,
        guess: options.guess,
        squishAnswers: true,    // this is so that there's always only a single correct answer
        numberOfAnswers: 6,     // this is so that there are 6 options to choose from for each question
        ...callbacks,
    };
    return createGameStore(apiOptions, (set, get, qsAndAs) => {
        const screensAndButtons = createScreensAndButtons(qsAndAs);
        return {
            type: "choice",
            options,
            ...screensAndButtons,
            ...getPublicActions(set, get),
            currentScreenId: screensAndButtons.screenIds[0],    // show first screen
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

    // add screens for each question
    for (let questionIndex = 0; questionIndex < qsAndAs.questionIds.length; questionIndex++) {
        const questionId = qsAndAs.questionIds[questionIndex];
        const question = qsAndAs.questions[questionId];
        if (!question)
            throw new QuestionNotFoundError(questionId);

        const { buttons, buttonIds } = createButtons(qsAndAs, question);    // get buttons for answers to this question
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

    // add results screen
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

    // create a button for each answer to the provided question
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
