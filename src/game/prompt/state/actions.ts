import { units, type Unit } from "src/data";
import { createActions, formatQuestion, getMatchingUnits, validateOptions, type GameOptions } from "src/game/common";
import { toShuffled } from "src/utils/shuffle";
import { validOptions } from "./gameOptions";
import { hook } from "./store";
import type { GuessResult, Prompt, PromptAnswer } from "./types";

const { initializeGame, finishGame, setInvalidState, togglePause, calculateTime } = createActions(hook);
export { calculateTime, togglePause };

export function gameFromOptions(options: GameOptions) {
    if (options === null || !validateOptions(options, validOptions)) {
        setInvalidState();
        return;
    }
    initializeGame(options);

    const matchingUnits = getMatchingUnits(units, options);
    const prompts = getPrompts(matchingUnits, options);
    hook.setState({
        prompts,
        current: 0,
        answered: 0,
    });
}

/** Generates an array of prompts about the provided administrative units. */
function getPrompts(units: Unit[], options: GameOptions): Prompt[] {
    const shuffledUnits = toShuffled(units);
    return shuffledUnits.map((unit, index) => ({
        about: unit.id,
        state: (index === 0) ? "answering" : "unanswered",
        question: formatQuestion(unit, options),
        answers: getPromptAnswers(unit, options),
        provided: 0,
        tries: 0,
    }));
}

function getPromptAnswers(unit: Unit, options: GameOptions): PromptAnswer[] {
    return getPromptAnswerStrings(unit, options).map((value) => ({
        guessed: false,
        value,
    }));
}

function getPromptAnswerStrings(unit: Unit, options: GameOptions): string[] {
    if (options.guess === "name") {
        return [unit.name];
    } else if (options.guess === "capital") {
        return unit.capitals;
    } else if (options.guess === "plate") {
        return unit.plates;
    }
    throw new Error("Invalid game options.");
}

/** Checks if the player's guess is correct. If it was, then proceeds to the next question.
 *  @throws if the game is unstarted, paused, finished or invalid
 *  @returns the result of this guess and, if the guess was incorrect and the required criteria were met,
 *  also returns a hint for the player. */
export function guess(playersGuess: string): [GuessResult, string | null] {
    const game = hook.getState();
    if (game.state !== "unpaused")
        throw new Error("Cannot perform this action while the game is unstarted, paused, finished or invalid.");

    const result = getGuessResult(playersGuess);
    if (result === "wrong") {
        hook.setState({
            prompts: game.prompts.map((prompt, index) => (index === game.current) ? {
                ...prompt,
                tries: prompt.tries + 1,        // if the provided answer was wrong, then increase the try counter
            } : prompt),
        });
        const hint = getHint();
        return [result, hint];  // early return with hint
    }

    if (result === "correct") {
        const prompt = game.prompts[game.current];
        const newPrompt = {
            ...prompt,
            answers: prompt.answers.map((answer) => (answer.value.toLowerCase() === playersGuess.toLowerCase()) ? {
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
            hook.setState({
                prompts: newPrompts,
                current: game.current + 1,
                answered: game.answered + 1,
            });

            if (game.answered + 1 === game.prompts.length) {
                finishGame();       // finish game if all prompts have been answered
            }
        } else {
            hook.setState({ prompts: newPrompts });
        }
    }
    return [result, null];
}

const TRIES_FOR_HINT = 1;
const TRIES_FOR_FULL_HINT = 6;

/** Returns a hint for the current prompt,
 *  if the player has exceeded the minimum number of incorrect guesses for a hint.
 *  Otherwise returns null. */
function getHint(): string | null {
    const game = hook.getState();
    const prompt = game.prompts[game.current];

    if (prompt.tries < TRIES_FOR_HINT) {
        return null;
    }
    if (prompt.tries >= TRIES_FOR_FULL_HINT) {
        return prompt.answers
            .map((answer) => answer.value)
            .join(", ");
    }

    const noOfLetters = prompt.tries - TRIES_FOR_HINT + 1;      // how many letters to uncover
    if (game.options.guess === "plate") {
        return prompt.answers
            .map((answer) => {
                if (noOfLetters > answer.value.length) {
                    return answer.value;
                }
                const uncoveredLetters = answer.value.slice(0, noOfLetters);
                return uncoveredLetters.padEnd(answer.value.length, "*");
            })
            .join(", ");
    } else if (game.options.guess === "name" || game.options.guess === "capital") {
        return prompt.answers
            .map((answer) => {
                let hint = "";
                for (let index = 0; index < answer.value.length; index++) {
                    const char = answer.value[index];
                    if (char === " ") {
                        hint += " ";
                    } else if (index < noOfLetters || index >= answer.value.length - noOfLetters) {
                        hint += char;
                    } else {
                        hint += "*";
                    }
                }
                return hint;
            })
            .join(", ");
    }
    return null;
}

/** Returns a guess result based on the player's answer to the current prompt. */
function getGuessResult(playersGuess: string): GuessResult {
    const game = hook.getState();
    const prompt = game.prompts[game.current];
    const answer = prompt.answers.find((answer) => answer.value.toLowerCase() === playersGuess.toLowerCase());
    if (!answer) {
        return "wrong";
    } else if (answer.guessed) {
        return "alreadyGuessed"
    } else {
        return "correct";
    }
}
