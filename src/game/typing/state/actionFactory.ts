import { getTextHint } from "src/game/common";
import type { StoreApi } from "zustand";
import type { GuessResult, TypingAnswer, TypingGameStore, TypingQuestion } from "./types";

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

        const question = game.questions.find((question) => question.id === questionId);
        if (!question)
            throw new Error("Couldn't find question with the specified ID: " + questionId);

        const answer = question.answers
            .find((answer) => answer.value.toLowerCase() === playersGuess.toLowerCase());
        if (!answer) {      // a correct answer with this text doesn't exist
            const newQuestion: TypingQuestion = {
                ...question,
                tries: question.tries + 1,  // increase try counter
            };
            set({
                questions: game.questions
                    .map((q) => (q.id === questionId) ? newQuestion : q),
            });
            const hint = getTextHint(newQuestion, game.options);
            return ["wrong", hint];
        }

        if (answer.guessed) {       // a correct answer with this text exist, but it was already provided
            return ["alreadyGuessed", null];
        } else {                    // a correct answer with this text exist
            const newAnswer: TypingAnswer = {
                ...answer,
                guessed: true,
                slotIndex,
            };
            const newQuestion: TypingQuestion = {
                ...question,
                answers: question.answers
                    .map((ans) => (ans.id === answer.id) ? newAnswer : ans),
                provided: question.provided + 1,
            };
            set({
                questions: game.questions
                    .map((q) => (q.id === question.id) ? newQuestion : q),
            });
            if (newQuestion.provided === question.answers.length) {
                set({
                    // if all answers to this question have been provided,
                    // then increase the answered question counter
                    answered: game.answered + 1,
                });
                if (game.answered + 1 === game.questions.length) {
                    game.finish();      // if all the questions have been answered, then finish the game
                }
            }
            return ["correct", null];
        }
    }

    return { guess };
}
