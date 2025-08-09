import { units, type Unit } from "src/data";
import { createActions, matchesFilters, validateOptions, type GameOptions, type UnitFilter } from "src/game/common";
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

    const unitTypeFilter: UnitFilter = { tag: options.unitType, mode: "include" };
    const allFilters = [unitTypeFilter, ...options.filters];

    const matchingUnits = units.filter((unit) => matchesFilters(unit, allFilters));

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
        state: (index === 0) ? "answering" : "unanswered",
        question: getPromptQuestion(unit, options),
        answers: getPromptAnswers(unit, options),
        provided: 0,
        tries: 0,
    }));
}

function getPromptQuestion(unit: Unit, options: GameOptions): string {
    if (options.guessFrom === "name") {
        if (options.guess === "capital") {
            return "Jakie stolice ma " + getNameWithPrefix(unit) + "?";
        } else if (options.guess === "plate") {
            return "Jakie rejestracje ma " + getNameWithPrefix(unit) + "?";
        }
    } else if (options.guessFrom === "capital" || options.guessFrom === "plate") {
        const prefix = (options.unitType === "voivodeship") ? "Jakie województwo" : "Jaki powiat";
        const suffix = (options.guessFrom === "capital")
            ? ((unit.capitals.length === 1) ? "ma stolicę" : "ma stolice") + " " + unit.capitals.join(", ")
            : ((unit.plates.length === 1) ? "ma rejestrację" : "ma rejestracje") + " " + unit.plates.join(", ");
        return prefix + " " + suffix + "?";
    } else if (options.guessFrom === "flag" || options.guessFrom === "coa") {
        const prefix = (options.unitType === "voivodeship") ? "Jakiego województwa" : "Jakiego powiatu";
        const suffix = (options.guessFrom === "flag") ? "flaga" : "herb";
        return prefix + " to " + suffix + "?";
    } else if (options.guessFrom === "map") {
        const suffix = (options.unitType === "voivodeship") ? "to województwo" : "ten powiat";
        if (options.guess === "name") {
            return "Jak się nazywa " + suffix + "?";
        } else if (options.guess === "capital") {
            return "Jakie stolice ma " + suffix + "?";
        } else if (options.guess === "plate") {
            return "Jakie rejestracje ma " + suffix + "?";
        }
    }
    throw new Error("Invalid game options.");
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

function getNameWithPrefix(unit: Unit) {
    if (unit.tags.includes("voivodeship")) {
        return "województwo " + unit.name;
    } else if (unit.tags.includes("city")) {
        return "miasto " + unit.name;
    } else {
        return "powiat " + unit.name;
    }
}

export function guess(playersGuess: string): GuessResult {
    const game = hook.getState();
    const result = getGuessResult(playersGuess);
    if (result === "correct") {
        const prompt = game.prompts[game.current];
        const newPrompt = {
            ...prompt,
            answers: prompt.answers.map((answer) => (answer.value === playersGuess) ? {
                ...answer,
                guessed: true,
            } : answer),
            provided: prompt.provided + 1,
        };

        // proceed to next prompt if all the correct answers have been provided by the player.
        const proceed = newPrompt.provided === newPrompt.answers.length;
        hook.setState({
            prompts: [
                ...game.prompts.slice(0, game.current),
                newPrompt,
                ...game.prompts.slice(game.current + 1),
            ],

            current: (proceed) ? game.current + 1 : game.current,
            answered: (proceed) ? game.answered + 1 : game.answered,
        });

        if (game.answered + 1 === game.prompts.length) {
            finishGame();       // finish game if all prompts have been answered
        }
    } else if (result === "wrong") {
        hook.setState({
            prompts: game.prompts.map((prompt, index) => (index === game.current) ? {
                ...prompt,
                tries: prompt.tries + 1,        // if the provided answer was wrong, then increase the try counter
            } : prompt),
        });
    }
    return result;
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
