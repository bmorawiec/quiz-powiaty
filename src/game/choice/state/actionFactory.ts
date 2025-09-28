import { AnswerNotFoundError, QuestionNotFoundError } from "src/game/common";
import { preloadImage } from "src/utils/preloadImage";
import type { StoreApi } from "zustand";
import type { ChoiceGameStore, GuessResult } from "./types";

export interface ChoiceGameStoreActions {
    /** Checks if the player's guess is correct. If it was, then proceeds to the next question.
     *  @throws if the game is paused or finished. */
    guess(answerId: string): GuessResult;
}

export function createChoiceGameStoreActions(
    set: StoreApi<ChoiceGameStore>["setState"],
    get: StoreApi<ChoiceGameStore>["getState"],
): ChoiceGameStoreActions {
    function guess(answerId: string): GuessResult {
        const game = get();
        if (game.state !== "unpaused")
            throw new Error("Cannot perform this action while the game is paused or finished.");

        const answer = game.answers[answerId];
        if (!answer)
            throw new AnswerNotFoundError(answerId);
        if (answer.questionId !== game.current)
            throw new Error("Selected answer does not belong to the current question.");

        if (answer.correct) {
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
        const nextQuestionId = game.questionIds[game.answered + 1];
        set({
            current: nextQuestionId,            // proceed to the next question
            answered: game.answered + 1,
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
        const guessingFlagOrCOA = game.options.guess === "flag" || game.options.guess === "coa";

        if (guessingFromFlagOrCOA || guessingFlagOrCOA) {
            const nextQuestionIndex = game.answered + 1;
            if (nextQuestionIndex < game.questionIds.length) {
                const nextQuestionId = game.questionIds[nextQuestionIndex];
                const nextQuestion = game.questions[nextQuestionId];
                if (!nextQuestion)
                    throw new QuestionNotFoundError(nextQuestionId);
                if (guessingFromFlagOrCOA) {
                    preloadImage(nextQuestion.value);   // preload image for the next question
                } else {
                    for (const answerId of nextQuestion.answerIds) {
                        const answer = game.answers[answerId];
                        if (!answer)
                            throw new AnswerNotFoundError(answerId);
                        preloadImage(answer.value);     // preload image for answers of the next question
                    }
                }
            }
        }
    }

    return { guess };
}
