import type { Unit } from "src/data/common";
import { units } from "src/data/units";
import { InvalidGameOptionsError, matchesFilters, type GameOptions } from "src/gameOptions";
import { toShuffled } from "src/utils/shuffle";
import { createActions, formatQuestion, getTextHint } from "../../common";
import { hook } from "./store";
import type { GuessResult, PromptAnswer, PromptQuestion } from "./types";

const { setOptions, startGame, resetGame, finishGame, togglePause, calculateTime } = createActions(hook);
export { resetGame, calculateTime, togglePause };

export function gameFromOptions(options: GameOptions) {
    setOptions(options);
    startGame();

    const filteredUnits = units
        .filter((unit) => unit.type === options.unitType && matchesFilters(unit, options.filters));
    const prompts = getPrompts(filteredUnits, options);
    hook.setState({
        prompts,
        current: 0,
        answered: 0,
    });
}

/** Generates an array of prompts about the provided administrative units. */
function getPrompts(units: Unit[], options: GameOptions): PromptQuestion[] {
    const shuffledUnits = toShuffled(units);
    return shuffledUnits.map((unit) => {
        const question: PromptQuestion = {
            id: unit.id,
            text: formatQuestion(unit, options),
            answers: getPromptAnswers(unit, options),
            provided: 0,
            tries: 0,
        };
        if (options.guessFrom === "flag") {
            question.imageURL = "/images/flag/" + unit.id + ".svg";
        } else if (options.guessFrom === "coa") {
            question.imageURL = "/images/coa/" + unit.id + ".svg";
        }
        return question;
    });
}

function getPromptAnswers(unit: Unit, options: GameOptions): PromptAnswer[] {
    return getPromptAnswerStrings(unit, options).map((text) => ({
        id: unit.id,
        text,
        correct: true,
        guessed: false,
    } satisfies PromptAnswer));
}

function getPromptAnswerStrings(unit: Unit, options: GameOptions): string[] {
    if (options.guess === "name") {
        return [unit.name];
    } else if (options.guess === "capital") {
        return unit.capitals;
    } else if (options.guess === "plate") {
        return unit.plates;
    }
    throw new InvalidGameOptionsError();
}

/** Checks if the player's guess is correct. If it was, then proceeds to the next question.
 *  @throws if the game is unstarted, paused or finished
 *  @returns the result of this guess and, if the guess was incorrect and the required criteria were met,
 *  also returns a hint for the player. */
export function guess(playersGuess: string): [GuessResult, string | null] {
    let game = hook.getState();
    if (game.state !== "unpaused")
        throw new Error("Cannot perform this action while the game is unstarted, paused or finished.");

    const result = getGuessResult(playersGuess);
    if (result === "wrong") {
        hook.setState({
            prompts: game.prompts.map((prompt, index) => (index === game.current) ? {
                ...prompt,
                tries: prompt.tries + 1,        // if the provided answer was wrong, then increase the try counter
            } : prompt),
        });

        game = hook.getState();         // game state has changed
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

/** Returns a guess result based on the player's answer to the current prompt. */
function getGuessResult(playersGuess: string): GuessResult {
    const game = hook.getState();
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
