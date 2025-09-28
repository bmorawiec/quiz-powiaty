import { preloadImage } from "src/utils/preloadImage";
import type { StoreApi } from "zustand";
import { AnswerNotFoundError, getTextHint, QuestionNotFoundError } from "../../common";
import type { GuessResult, PromptAnswer, PromptGameStore } from "./types";

export interface PromptGameStoreActions {
    /** Checks if the player's guess is correct. If it was, then proceeds to the next question.
     *  @throws if the game is paused or finished
     *  @returns the result of this guess and, if the guess was incorrect and the required criteria were met,
     *  also returns a hint for the player. */
    guess(playersGuess: string): [GuessResult, string | null];
}

export function createPromptGameStoreActions(
    set: StoreApi<PromptGameStore>["setState"],
    get: StoreApi<PromptGameStore>["getState"],
): PromptGameStoreActions {
    function guess(playersGuess: string): [GuessResult, string | null] {
        const game = get();
        if (game.state !== "unpaused")
            throw new Error("Cannot perform this action while the game is paused or finished.");

        const answer = getMatchingAnswer(playersGuess);
        if (answer) {
            if (answer.guessed) {       // a correct answer with this value exists, but it was already provided
                return ["alreadyGuessed", null];
            } else {                    // a correct answer with this value exist
                nextAnswer(answer);
                return ["correct", null];
            }
        } else {        // a correct answer with this value doesn't exist
            increaseTryCount();

            const hint = getHintForCurrent();
            return ["wrong", hint];
        }
    }

    /** Finds an answer to the current question, of which the value matches the player's guess.
     *  Returns null if no answer matches the player's guess. */
    function getMatchingAnswer(playersGuess: string): PromptAnswer | null {
        const game = get();

        const question = game.questions[game.current];
        if (!question)
            throw new QuestionNotFoundError(game.current);

        for (const answerId of question.answerIds) {
            const answer = game.answers[answerId];
            if (!answer)
                throw new AnswerNotFoundError(answerId);

            if (playersGuess.toLowerCase() === answer.value.toLowerCase()) {
                return answer;
            }
        }
        return null;
    }

    /** Returns a hint for the current question. */
    function getHintForCurrent(): string | null {
        const game = get();

        const question = game.questions[game.current];
        if (!question)
            throw new QuestionNotFoundError(game.current);

        const answers = question.answerIds.map((answerId) => {
            const answer = game.answers[answerId];
            if (!answer)
                throw new AnswerNotFoundError(answerId);
            return answer;
        });
        return getTextHint(question.tries, answers, game.options);
    }

    /** Proceeds to the next answer and marks the just-guessed one as guessed.
     *  Proceeds onto the next question if all the answers have been provided.
     *  @param guessedAnswer - the answer that the user has just guessed. */
    function nextAnswer(guessedAnswer: PromptAnswer) {
        const game = get();

        const question = game.questions[game.current];
        if (!question)
            throw new QuestionNotFoundError(game.current);
        set({
            questions: {
                ...game.questions,
                [game.current]: {
                    ...question,
                    provided: question.provided + 1,
                },
            },
            answers: {
                ...game.answers,
                [guessedAnswer.id]: {
                    ...guessedAnswer,
                    guessed: true,
                },
            },
        });

        if (question.provided + 1 >= question.answerIds.length) {
            nextQuestion();     // proceed to the next question if all answers to this question have been given
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

    /** Preloads images for the next question. */
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
