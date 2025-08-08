import { UnitNotFoundError, units, type Unit } from "src/data";
import { createActions, matchesFilters, type GameOptions, type UnitFilter } from "src/game/common";
import { isValidCombo } from "src/game/common/combos";
import { toShuffled } from "src/utils/shuffle";
import { validCombos } from "./combos";
import { PromptStateNotFoundError } from "./errors";
import { hook } from "./store";
import type { GuessResult, PromptState } from "./types";

const { initializeGame, finishGame, setInvalidState, togglePause, calculateTime } = createActions(hook);
export { calculateTime, togglePause };

export function gameFromOptions(options: GameOptions) {
    if (options === null || !isValidCombo(validCombos, options.guessFrom, options.guess)) {
        setInvalidState();
        return;
    }
    initializeGame(options);

    const unitTypeFilter: UnitFilter = { tag: options.unitType, mode: "include" };
    const allFilters = [unitTypeFilter, ...options.filters];

    const matchingUnits = units.filter((unit) => matchesFilters(unit, allFilters));

    const shuffledIds = toShuffled(matchingUnits.map((unit) => unit.id));
    const firstId = shuffledIds[0];

    hook.setState({
        prompts: {
            ids: shuffledIds,
            states: getInitialPromptStates(matchingUnits, firstId),
            current: firstId,
            answered: 0,
            total: matchingUnits.length,
        },
    });
}

function getInitialPromptStates(matchingUnits: Unit[], firstId: string): Record<string, PromptState | undefined> {
    const states: Record<string, PromptState | undefined> = {};
    for (const unit of matchingUnits) {
        states[unit.id] = {
            id: unit.id,
            state: (unit.id === firstId) ? "answering" : "unanswered",
            correctGuesses: [],
            tries: 0,
        };
    }
    return states;
}

export function guess(answer: string): GuessResult {
    const game = hook.getState();
    const result = getGuessResult(answer);
    if (result === "correct") {
        modifyPromptState(game.prompts.current, (promptState) => ({
            correctGuesses: [...promptState.correctGuesses, answer],
        }));
        nextPrompt();
    } else if (result === "wrong") {
        nextTry();
    }
    return result;
}

/** Returns a guess result based on the player's answer to the current prompt. */
function getGuessResult(answer: string): GuessResult {
    const game = hook.getState();
    const options = game.options;

    const promptState = game.prompts.states[game.prompts.current];
    if (!promptState)
        throw new PromptStateNotFoundError(game.prompts.current);

    const promptUnit = units.find((unit) => unit.id === game.prompts.current);
    if (!promptUnit)
        throw new UnitNotFoundError(game.prompts.current);

    if (options.guess === "name") {
        return (answer === promptUnit.name) ? "correct" : "wrong";
    } else if (options.guess === "capital") {
        return (promptUnit.capitals.includes(answer)) ? "correct" : "wrong";
    } else if (options.guess === "allCapitals") {
        return (promptState.correctGuesses.includes(answer))
            ? "alreadyGuessed"
            : (promptUnit.capitals.includes(answer)) ? "correct" : "wrong";
    } else if (options.guess === "plate") {
        return (promptUnit.plates.includes(answer)) ? "correct" : "wrong";
    } else if (options.guess === "allPlates") {
        return (promptState.correctGuesses.includes(answer))
            ? "alreadyGuessed"
            : (promptUnit.capitals.includes(answer)) ? "correct" : "wrong";
    } else {
        throw new Error("Invalid game options.");
    }
}

/** Proceeds to the next prompt.
 *  If the current prompt was the final prompt, then finishes the game.
 *  @throws if the game is unstarted, paused, finished or invalid. */
function nextPrompt() {
    const game = hook.getState();
    if (game.state !== "unpaused")
        throw new Error("Cannot proceed to next prompt when the game is unstarted, paused, finished or invalid.");

    if (game.prompts.answered + 1 === game.prompts.total) {     // check whether all prompts have been answered
        finishGame();

        hook.setState({
            prompts: {
                ...game.prompts,
                answered: game.prompts.answered + 1,
            },
        });
    } else {
        const nextId = game.prompts.ids[game.prompts.answered + 1];
        modifyPromptState(game.prompts.current, { state: "answered" });
        modifyPromptState(nextId, { state: "answering" });

        hook.setState({
            prompts: {
                ...game.prompts,
                current: nextId,
                answered: game.prompts.answered + 1,
            },
        });
    }
}

/** Proceed to the next try on the current prompt.
 *  @throws if the game is unstarted, paused, finished or invalid. */
function nextTry() {
    const game = hook.getState();
    if (game.state !== "unpaused")
        throw new Error("Cannot proceed to next prompt when the game is unstarted, paused, finished or invalid.");

    modifyPromptState(game.prompts.current, (promptState) => ({
        tries: promptState.tries + 1,
    }));
}

function modifyPromptState(
    id: string,
    stateOrFn: Partial<PromptState> | ((state: PromptState) => Partial<PromptState>),
) {
    const game = hook.getState();

    const currentState = game.prompts.states[id];
    if (!currentState)
        throw new PromptStateNotFoundError(id);

    const newState = (typeof stateOrFn === "function") ? stateOrFn(currentState) : stateOrFn;
    hook.setState((game) => ({
        prompts: {
            ...game.prompts,
            states: {
                ...game.prompts.states,
                [id]: {
                    ...currentState,
                    ...newState,
                },
            },
        }
    }));
}
