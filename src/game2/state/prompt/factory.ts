import { QuestionNotFoundError, type Answers, type Questions } from "src/game2/questions";
import { createGameStore, type GameAPICallbacks, type GameAPIOptions } from "src/game2/api";
import { type GameOptions } from "src/game2/options";
import type { ZustandHook } from "src/utils/zustand";
import { ulid } from "ulid";
import { type FinalPromptScreen, type PromptGameStore, type PromptScreen, type PromptScreens } from "./types";
import { getPublicActions } from "./actions";

/** Creates a game store based on the provided options.
 *  Assumes that options have been validated. */
export async function createPromptGameStore(
    questionsAndAnswers: Questions & Answers,
    options: GameOptions,
    callbacks: GameAPICallbacks,
): Promise<ZustandHook<PromptGameStore>> {
    const apiOptions: GameAPIOptions = {
        questionsAndAnswers,
        ...callbacks,
    };
    return createGameStore(apiOptions, (set, get) => {
        const screensAndButtons = createScreens(questionsAndAnswers);
        return {
            type: "prompt",
            options,
            ...screensAndButtons,
            ...getPublicActions(set, get),
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
