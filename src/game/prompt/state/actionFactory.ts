import { preloadImage } from "src/utils/preloadImage";
import { getTextHint } from "../../common";
import type { GuessResult, PromptGameStore } from "./types";
import type { StoreApi } from "zustand";

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
        let game = get();
        if (game.state !== "unpaused")
            throw new Error("Cannot perform this action while the game is paused or finished.");

        const result = getGuessResult(playersGuess);
        if (result === "wrong") {
            set({
                prompts: game.prompts.map((prompt, index) => (index === game.current) ? {
                    ...prompt,
                    tries: prompt.tries + 1,        // if the provided answer was wrong, then increase the try counter
                } : prompt),
            });

            game = get();       // game state has changed
            const currentPrompt = game.prompts[game.current];
            const hint = getTextHint(currentPrompt, game.options);

            return [result, hint];  // early return with hint
        }

        if (result === "correct") {
            const prompt = game.prompts[game.current];
            const newPrompt = {
                ...prompt,
                answers: prompt.answers.map((answer) => (answer.text.toLowerCase() === playersGuess.toLowerCase()) ? {
                    ...answer,
                    guessed: true,
                } : answer),
                provided: prompt.provided + 1,
            };

            const newPrompts = [
                ...game.prompts.slice(0, game.current),
                newPrompt,
                ...game.prompts.slice(game.current + 1),
            ];
            // proceed to next prompt if all the correct answers have been provided by the player.
            if (newPrompt.provided === newPrompt.answers.length) {
                set({
                    prompts: newPrompts,
                    current: game.current + 1,
                    answered: game.answered + 1,
                });

                if (game.answered + 1 === game.prompts.length) {
                    game.finish();      // finish game if all prompts have been answered
                } else if (game.options.guessFrom === "flag" || game.options.guessFrom === "coa") {
                    if (game.current + 2 < game.prompts.length) {
                        const nextNextQuestion = game.prompts[game.current + 2];
                        preloadImage(nextNextQuestion.imageURL!);       // preload image for soon-to-be next prompt
                    }
                }
            } else {
                set({
                    prompts: newPrompts,
                });
            }
        }
        return [result, null];
    }

    /** Returns a guess result based on the player's answer to the current prompt. */
    function getGuessResult(playersGuess: string): GuessResult {
        const game = get();
        const prompt = game.prompts[game.current];
        const answer = prompt.answers.find((answer) => answer.text.toLowerCase() === playersGuess.toLowerCase());
        if (!answer) {
            return "wrong";
        } else if (answer.guessed) {
            return "alreadyGuessed"
        } else {
            return "correct";
        }
    }

    return { guess };
}
