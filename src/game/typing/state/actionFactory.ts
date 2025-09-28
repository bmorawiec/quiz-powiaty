import { AnswerNotFoundError, getTextHint, QuestionNotFoundError } from "src/game/common";
import type { StoreApi } from "zustand";
import type { GuessResult, TypingAnswer, TypingGameStore } from "./types";
import type { PromptAnswer } from "src/game/prompt";

export interface TypingGameStoreActions {
    /** Checks if the player's guess is correct.
     *  @throws if the game is paused or finished
     *  @returns the result of this guess and, if the guess was incorrect and the required criteria were met,
     *  also returns a hint for the player. */
    guess(questionId: string, playersGuess: string, slotIndex: number): [GuessResult, string | null];
}

export function createTypingGameStoreActions(
    set: StoreApi<TypingGameStore>["setState"],
    get: StoreApi<TypingGameStore>["getState"],
): TypingGameStoreActions {
    function guess(questionId: string, playersGuess: string, slotIndex: number): [GuessResult, string | null] {
        const game = get();
        if (game.state !== "unpaused")
            throw new Error("Cannot perform this action while the game is paused or finished.");

        const answer = getMatchingAnswer(questionId, playersGuess);
        if (answer) {
            if (answer.guessed) {       // a correct answer with this value exists, but it was already provided
                return ["alreadyGuessed", null];
            } else {                    // a correct answer with this value exist
                nextAnswer(answer);
                moveAnswerIntoSlot(answer, slotIndex);
                return ["correct", null];
            }
        } else {        // a correct answer with this value doesn't exist
            increaseTryCount(questionId);

            const hint = getHintFor(questionId);
            return ["wrong", hint];
        }
    }

    /** Finds an answer to the current question, with a value that matches the player's guess.
     *  Returns null if no answer matches the player's guess. */
    function getMatchingAnswer(questionId: string, playersGuess: string): TypingAnswer | null {
        const game = get();

        const question = game.questions[questionId];
        if (!question)
            throw new QuestionNotFoundError(questionId);

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

    function moveAnswerIntoSlot(answer: TypingAnswer, slotIndex: number) {
        const game = get();

        const question = game.questions[answer.questionId];
        if (!question)
            throw new QuestionNotFoundError(answer.questionId);

        const answerIdInSlot = question.answerIds[slotIndex];
        if (answerIdInSlot !== answer.id) {
            set({
                questions: {
                    ...game.questions,
                    [answer.questionId]: {
                        ...question,
                        answerIds: question.answerIds.map((currentId) => {
                            if (currentId === answer.id) {
                                return answerIdInSlot;
                            } else if (currentId === answerIdInSlot) {
                                return answer.id;
                            } else {
                                return currentId;
                            }
                        }),
                    },
                },
            });
        }
    }

    /** Returns a hint for the specified question. */
    function getHintFor(questionId: string): string | null {
        const game = get();

        const question = game.questions[questionId];
        if (!question)
            throw new QuestionNotFoundError(questionId);

        const answers = question.answerIds.map((answerId) => {
            const answer = game.answers[answerId];
            if (!answer)
                throw new AnswerNotFoundError(answerId);
            return answer;
        });
        return getTextHint(question.tries, answers, game.options);
    }

    /** Marks the specified answer as guessed.
     *  Ends the game if all the questions were answered.
     *  @param guessedAnswer - the answer that the user has just guessed. */
    function nextAnswer(guessedAnswer: PromptAnswer) {
        const game = get();

        const question = game.questions[guessedAnswer.questionId];
        if (!question)
            throw new QuestionNotFoundError(guessedAnswer.questionId);
        set({
            questions: {
                ...game.questions,
                [guessedAnswer.questionId]: {
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
            set({
                answered: game.answered + 1,
            });

            if (game.answered + 1 >= game.questionIds.length) {
                game.finish();          // finish game if all questions have been answered
            }
        }
    }

    /** Increases the try counter for the specified question. */
    function increaseTryCount(questionId: string) {
        const game = get();

        const question = game.questions[questionId];
        if (!question)
            throw new QuestionNotFoundError(questionId);

        set({
            questions: {
                ...game.questions,
                [questionId]: {
                    ...question,
                    tries: question.tries + 1,
                },
            },
        });
    }

    return { guess };
}
