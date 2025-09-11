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

        const question = game.questions[game.current];
        const answer = question.answers.find((answer) => answer.id === answerId);
        if (!answer)
            throw new Error("Cannot find answer with the specified ID: " + answerId);
        const result = (answer.correct) ? "correct" : "wrong";

        if (result === "correct") {
            // proceed to the next question
            set({
                current: game.current + 1,
                answered: game.answered + 1,
            });
            if (game.answered + 1 === game.questions.length) {
                game.finish();          // finish game if all questions have been answered
            } else if (game.current + 2 < game.questions.length) {
                if (game.options.guessFrom === "flag" || game.options.guessFrom === "coa") {
                    const nextNextQuestion = game.questions[game.current + 2];
                    preloadImage(nextNextQuestion.imageURL!);       // preload image for soon-to-be next question
                } else if (game.options.guess === "flag" || game.options.guess === "coa") {
                    const nextNextQuestion = game.questions[game.current + 2];
                    for (const answer of nextNextQuestion.answers) {
                        preloadImage(answer.imageURL!);     // preload images for answers of soon-to-be next question
                    }
                }
            }
        } else {
            set({
                questions: game.questions.map((question, index) => (index === game.current) ? {
                    ...question,
                    tries: question.tries + 1,  // if the provided answer was wrong, then increase the try counter
                } : question),
            });
        }

        return result;
    }

    return { guess };
}
