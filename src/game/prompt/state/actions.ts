import type { Unit } from "src/data/common";
import { units } from "src/data/units";
import { InvalidGameOptionsError, matchesFilters, type GameOptions } from "src/gameOptions";
import { preloadImage } from "src/utils/preloadImage";
import { toShuffled } from "src/utils/shuffle";
import { createActions, formatQuestion, getTextHint } from "../../common";
import { hook } from "./store";
import type { GuessResult, PromptAnswer, PromptQuestion } from "./types";

const { resetGame, finishGame, togglePause, calculateTime } = createActions(hook);
export { calculateTime, resetGame, togglePause };

export async function gameFromOptions(options: GameOptions) {
    let game = hook.getState();
    if (game.state !== "unstarted") {
        throw new Error("The game hasn't been reset properly before being started.");
    }

    hook.setState({
        state: "starting",
    });

    const filteredUnits = units
        .filter((unit) => unit.type === options.unitType && matchesFilters(unit, options.filters));
    const prompts = getPrompts(filteredUnits, options);
    if (options.guessFrom === "flag" || options.guessFrom === "coa") {
        const firstTwoPrompts = prompts.slice(0, 2);
        // preload flags/COAs for the first two prompts
        await Promise.all(firstTwoPrompts.map((prompt) => preloadImage(prompt.imageURL!)));
    }

    game = hook.getState();
    // the player has reset the game before it fully started
    if (game.state === "unstarted") {
        return;
    }

    hook.setState({
        state: "unpaused",
        timestamps: [Date.now()],
        options,
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
 *  @throws if the game is unstarted, starting, paused or finished
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
            } else if (game.options.guessFrom === "flag" || game.options.guessFrom === "coa") {
                if (game.current + 2 < game.prompts.length) {
                    const nextNextQuestion = game.prompts[game.current + 2];
                    preloadImage(nextNextQuestion.imageURL!);       // preload image for soon-to-be next prompt
                }
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
