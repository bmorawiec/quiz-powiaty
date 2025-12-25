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
    type Button,
    type Buttons,
    type ChoiceGameActions,
    type ChoiceGameStore,
    type ChoiceScreen,
    type ChoiceScreens,
} from "./types";

export async function createChoiceGameStore(options: GameOptions): Promise<ZustandHook<ChoiceGameStore>> {
    const [units] = await unitsFromOptions(options);
    const apiOptions: GameAPIOptions = {
        units,
        guessFrom: options.guessFrom,
        guess: options.guess,
        providePlausibleAnswers: true,
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

function createScreensAndButtons(qsAndAs: Questions & Answers): ChoiceScreens & Buttons {
    const result: ChoiceScreens & Buttons = {
        screens: {},
        screenIds: [],

        buttons: {},
        buttonIds: [],
    };

    for (const questionId of qsAndAs.questionIds) {
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

    return result;
}

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
            return "correct";
        } else {
            get().api.incorrectGuess(answer.questionId);
            return "wrong";
        }
    }

    function switchScreens(screenId: string | "finishScreen") {
        set({
            currentScreenId: screenId,
        });
    }

    return { guess, switchScreens };
}
