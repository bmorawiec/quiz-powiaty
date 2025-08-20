import { units, type Unit } from "src/data";
import { createActions, formatQuestion, InvalidGameOptionsError, matchesFilters, validateOptions, type GameOptions } from "src/game/common";
import { toShuffled } from "src/utils/shuffle";
import { validOptions } from "./gameOptions";
import { hook } from "./store";
import type { GuessResult, Question, QuestionOption } from "./types";

const { initializeGame, finishGame, setInvalidState, togglePause, calculateTime } = createActions(hook);
export { calculateTime, togglePause };

export function gameFromOptions(options: GameOptions) {
    if (options === null || !validateOptions(options, validOptions)) {
        setInvalidState();
        return;
    }
    initializeGame(options);

    const matchingUnits = units.filter((unit) => unit.type === options.unitType);
    const filteredUnits = matchingUnits.filter((unit) => matchesFilters(unit, options.filters));
    const questions = getQuestions(filteredUnits, matchingUnits, options);
    hook.setState({
        questions,
        current: 0,
        answered: 0,
    });
}

/** Generates an array of questions about the provided administrative units. */
function getQuestions(units: Unit[], allUnits: Unit[], options: GameOptions): Question[] {
    const shuffledUnits = toShuffled(units);
    return shuffledUnits.map((unit) => ({
        about: unit.id,
        value: formatQuestion(unit, options),
        options: getQuestionOptions(unit, allUnits, options),
        tries: 0,
    } satisfies Question));
}

function getQuestionOptions(unit: Unit, allUnits: Unit[], options: GameOptions): QuestionOption[] {
    const answerUnits: Unit[] = [];

    // randomly choose five incorrect answers
    while (answerUnits.length < 5) {
        const randomIndex = Math.floor(Math.random() * allUnits.length);
        const incorrectUnit = allUnits[randomIndex];
        if (incorrectUnit !== unit && !answerUnits.find((unit) => unit.id === incorrectUnit.id)) {
            answerUnits.push(incorrectUnit);
        }
    }

    // insert correct answer randomly somewhere in the array
    const index = Math.floor(Math.random() * 5);
    answerUnits.splice(index, 0, unit);

    return answerUnits.map((answerUnit) => ({
        id: answerUnit.id,
        correct: answerUnit === unit,
        value: getOptionValue(answerUnit, options),
    } satisfies QuestionOption));
}

function getOptionValue(unit: Unit, options: GameOptions): string {
    if (options.guess === "name") {
        return unit.name;
    } else if (options.guess === "capital") {
        return unit.capitals.join(", ");
    } else if (options.guess === "plate") {
        return unit.plates.join(", ");
    } else if (options.guess === "flag" || options.guess === "coa") {
        return unit.id;
    }
    throw new InvalidGameOptionsError();
}

/** Checks if the player's guess is correct. If it was, then proceeds to the next question.
 *  @throws if the game is unstarted, paused, finished or invalid */
export function guess(answerId: string): GuessResult {
    const game = hook.getState();
    if (game.state !== "unpaused")
        throw new Error("Cannot perform this action while the game is unstarted, paused, finished or invalid.");

    const question = game.questions[game.current];
    const answer = question.options.find((option) => option.id === answerId);
    if (!answer)
        throw new Error("Cannot find answer with the specified ID: " + answerId);
    const result = (answer.correct) ? "correct" : "wrong";

    if (result === "correct") {
        hook.setState({
            current: game.current + 1,
            answered: game.answered + 1,
        });
        if (game.answered + 1 === game.questions.length) {
            finishGame();       // finish game if all questions have been answered
        }
    } else {
        hook.setState({
            questions: game.questions.map((prompt, index) => (index === game.current) ? {
                ...prompt,
                tries: prompt.tries + 1,        // if the provided answer was wrong, then increase the try counter
            } : prompt),
        });
    }

    return result;
}
