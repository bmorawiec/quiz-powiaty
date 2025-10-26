import { QuestionNotFoundError } from "src/game/common";
import { preloadImage } from "src/utils/preloadImage";
import type { StoreApi } from "zustand";
import type { GuessResult, MapGameStore } from "./types";

export interface MapGameStoreActions {
    /** Checks if the player's guess is correct. If it was, then proceeds to the next question.
     *  @throws if the game is paused or finished. */
    guess(unitId: string): GuessResult;
}

export function createMapGameStoreActions(
    set: StoreApi<MapGameStore>["setState"],
    get: StoreApi<MapGameStore>["getState"],
): MapGameStoreActions {
    function guess(unitId: string): GuessResult {
        const game = get();
        if (game.state !== "unpaused")
            throw new Error("Cannot perform this action while the game is paused or finished.");

        const question = game.questions[game.current];
        if (!question)
            throw new QuestionNotFoundError(game.current);

        if (unitId === question.about) {
            nextQuestion();
            return "correct";
        } else {
            increaseTryCount();
            return "wrong";
        }
    }

    /** Proceeds onto the next question. Preloads images for the next-next question.
     *  Ends the game if all the questions have been answered. */
    function nextQuestion() {
        const game = get();

        const question = game.questions[game.current];
        if (!question)
            throw new QuestionNotFoundError(game.current);

        const nextQuestionId = game.questionIds[game.answered + 1];
        set({
            current: nextQuestionId,            // proceed to the next question
            answered: game.answered + 1,
            questions: {
                ...game.questions,
                [game.current]: {
                    ...question,
                    guessed: true,
                },
            },
        });

        if (game.answered + 1 >= game.questionIds.length) {
            game.finish();          // finish game if all questions have been answered
        } else {
            preloadNextQuestionImage();         // preload image for now next question
        }
    }

    /** Increases the try counter for the current question. */
    function increaseTryCount() {
        const game = get();

        const question = game.questions[game.current];
        if (!question)
            throw new QuestionNotFoundError(game.current);

        set({
            questions: {
                ...game.questions,
                [game.current]: {
                    ...question,
                    tries: question.tries + 1,
                },
            },
        });
    }

    /** Preloads images for the next question, or for the answers of the next question,
     *  depending on game options. */
    function preloadNextQuestionImage() {
        const game = get();

        const guessingFromFlagOrCOA = game.options.guessFrom === "flag" || game.options.guessFrom === "coa";
        if (guessingFromFlagOrCOA) {
            const nextQuestionIndex = game.answered + 1;
            if (nextQuestionIndex < game.questionIds.length) {
                const nextQuestionId = game.questionIds[nextQuestionIndex];
                const nextQuestion = game.questions[nextQuestionId];
                if (!nextQuestion)
                    throw new QuestionNotFoundError(nextQuestionId);

                preloadImage(nextQuestion.value);   // preload image for the next question
            }
        }
    }

    return { guess };
}
