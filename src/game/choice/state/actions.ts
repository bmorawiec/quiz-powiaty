import { units, type Unit } from "src/data";
import {
    createActions,
    formatQuestion,
    InvalidGameOptionsError,
    matchesFilters,
    validateOptions,
    type GameOptions,
} from "src/game/common";
import { toShuffled } from "src/utils/shuffle";
import { validOptions } from "./gameOptions";
import { hook } from "./store";
import type { GuessResult, Question, QuestionOption } from "./types";
import { swapDiacritics } from "src/utils/diacritics";

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
    const questionOptions: QuestionOption[] = getPlausibleOptions(unit, allUnits, options);

    // randomly choose five incorrect answers
    while (questionOptions.length < 5) {
        const randomIndex = Math.floor(Math.random() * allUnits.length);
        const incorrectUnit = allUnits[randomIndex];
        if (incorrectUnit !== unit && !questionOptions.some((option) => option.id === incorrectUnit.id)) {
            questionOptions.push({
                id: incorrectUnit.id,
                correct: false,
                value: getOptionValue(incorrectUnit, options),
            });
        }
    }

    // add correct answer to array of options
    questionOptions.push({
        id: unit.id,
        correct: true,
        value: getOptionValue(unit, options),
    });

    return toShuffled(questionOptions);
}

/** Creates question options that are plausible answers to the question. */
function getPlausibleOptions(unit: Unit, allUnits: Unit[], options: GameOptions): QuestionOption[] {
    if (options.guess === "plate" && (options.guessFrom === "name" || options.guessFrom === "capital")) {
        const cityMode = unit.countyType === "city";
        const pairs = [];
        for (const answerUnit of allUnits) {
            if (answerUnit === unit) {
                continue;
            }
            let scoreSum = 0;
            for (const plate of answerUnit.plates) {
                const nameScore = getPlateScore(plate, unit.name, cityMode);
                const capitalScores = unit.capitals.map((capital) => getPlateScore(plate, capital, cityMode));
                const score = Math.max(nameScore, ...capitalScores);
                scoreSum += score;
            }
            pairs.push({
                score: scoreSum / answerUnit.plates.length,
                option: {
                    id: answerUnit.id,
                    correct: false,
                    value: answerUnit.plates.join(", "),
                } satisfies QuestionOption,
            });
        }
        return pairs
            .sort((a, b) => b.score - a.score)
            .slice(0, 5)
            .map((obj) => obj.option);
    } else if (options.guessFrom === "plate" && (options.guess === "name" || options.guess === "capital")) {
        return [];
    } else {
        return [];
    }
}

/** Assigns a score to a car plate based on how much it matches the provided string
 *  score       example                 example in city mode    example for voivodeships
 *              plate   string          plate string            plate   string
 *
 *  10 000      LJA     Jasło           not assigned            not assigned
 *               ^^     ^^
 *  1 000       RZE     Zgorzelec       not assigned            not assigned
 *               ^^     ^    ^
 *  500         RLS     Ruda Śląska     not assigned            not assigned
 *              ^^^     ^     ^ ^
 *  100         BHA     Hrubieszów      BH      Hrubieszów      not assigned
 *               ^      ^                ^      ^
 *  50          KRA     Kartuzy         KR      Kartuzy         not assigned
 *              ^^      ^ ^             ^^      ^ ^
 *  5           LZA     Łódź            LZ      Łódź            L       Łódź
 *              ^       ^               ^       ^               ^       ^
 */
function getPlateScore(plate: string, str: string, cityMode: boolean): number {
    if (cityMode && plate.length === 3) {       // discard plates that have 3 chars when in city mode
        return 0;
    }
    if (plate.length === 1) {                   // skip the rest of the fn for voivodehsips
        const upperFirst = swapDiacritics(str[0].toUpperCase());
        if (upperFirst === plate) {
            return 5;
        } else {
            return 0;
        }
    }

    const upperCaseStr = swapDiacritics(str.toUpperCase());
    if (plate.slice(1) === upperCaseStr.slice(0, 2)) {  // always false in cityMode
        return 10_000;
    }

    let score = 0;
    if (upperCaseStr[0] === plate[1]) {
        const index = upperCaseStr.indexOf(plate[2]);   // -1 in cityMode
        if (index > 0) score += 1_000;
        else score += 100;
    }
    if (upperCaseStr[0] === plate[0]) {
        const index1 = upperCaseStr.indexOf(plate[1]);
        const index2 = upperCaseStr.indexOf(plate[2]);  // -1 in cityMode
        if (index1 > 0) {
            if (index2 > 0 && index1 < index2) score += 500;
            else score += 50;
        } else {
            score += 5;
        }
    }
    return score;
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
