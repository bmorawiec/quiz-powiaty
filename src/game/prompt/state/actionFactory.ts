import type { StoreApi } from "zustand";
import { getTextHint } from "../../common";
import type { GuessResult, PromptAnswer, PromptGameStore, PromptQuestion } from "./types";
import { preloadImage } from "src/utils/preloadImage";

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

        const prompt = game.prompts[game.current];
        const answer = prompt.answers
            .find((answer) => answer.value.toLowerCase() === playersGuess.toLowerCase());
        if (!answer) {          // a correct answer with this text doesn't exist
            const newPrompt: PromptQuestion = {
                ...prompt,
                tries: prompt.tries + 1,
            };
            set({
                prompts: game.prompts
                    .map((p) => (p.id === prompt.id) ? newPrompt : p)
            });
            const hint = getTextHint(newPrompt, game.options);
            return ["wrong", hint];
        }

        if (answer.guessed) {   // a correct answer with this text exist, but it was already provided
            return ["alreadyGuessed", null];
        } else {                // a correct answer with this text exist
            const newAnswer: PromptAnswer = {
                ...answer,
                guessed: true,
            };
            const newPrompt: PromptQuestion = {
                ...prompt,
                answers: prompt.answers
                    .map((ans) => (ans.id === answer.id) ? newAnswer : ans),
                provided: prompt.provided + 1,
            };
            set({
                prompts: game.prompts
                    .map((p) => (p.id === prompt.id) ? newPrompt : p),
            });
            if (newPrompt.provided === prompt.answers.length) {
                set({
                    // if all answers to this question have been provided,
                    // then proceed to the next question
                    current: game.current + 1,
                    answered: game.answered + 1,
                });
                if (game.answered + 1 === game.prompts.length) {
                    game.finish();      // if all the questions have been answered, then finish the game
                } else if (game.options.guessFrom === "flag" || game.options.guessFrom === "coa") {
                    if (game.current + 2 < game.prompts.length) {
                        const nextNextPrompt = game.prompts[game.current + 2];
                        preloadImage(nextNextPrompt.value);     // preload image for soon-to-be next prompt
                    }
                }
            }
            return ["correct", null];
        }
    }

    return { guess };
}
