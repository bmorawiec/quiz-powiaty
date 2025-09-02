import type { Unit } from "src/data/common";
import { units } from "src/data/units";
import { InvalidGameOptionsError, matchesFilters, validateOptions, type GameOptions } from "src/gameOptions";
import { toShuffled } from "src/utils/shuffle";
import { createActions, formatQuestion } from "../../common";
import { validOptions } from "./gameOptions";
import { plausibleOptionUnits } from "./plausibleOptions";
import { hook } from "./store";
import type { GuessResult, ChoiceQuestion, ChoiceAnswer } from "./types";

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
function getQuestions(units: Unit[], allUnits: Unit[], options: GameOptions): ChoiceQuestion[] {
    const shuffledUnits = toShuffled(units);
    return shuffledUnits.map((unit) => {
        const question: ChoiceQuestion = {
            id: unit.id,
            text: formatQuestion(unit, options),
            answers: getQuestionOptions(unit, allUnits, options),
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

function getQuestionOptions(unit: Unit, allUnits: Unit[], options: GameOptions): ChoiceAnswer[] {
    const questionOptions: ChoiceAnswer[] = plausibleOptionUnits(unit, allUnits, options)
        .map((unit) => getAnswerFromUnit(unit, options));

    // randomly choose five incorrect answers
    while (questionOptions.length < 5) {
        const randomIndex = Math.floor(Math.random() * allUnits.length);
        const incorrectUnit = allUnits[randomIndex];
        if (incorrectUnit !== unit && !questionOptions.some((option) => option.id === incorrectUnit.id)) {
            questionOptions.push(getAnswerFromUnit(incorrectUnit, options));
        }
    }

    // add correct answer to array of options
    questionOptions.push(getAnswerFromUnit(unit, options, true));

    return toShuffled(questionOptions);
}

function getAnswerFromUnit(unit: Unit, options: GameOptions, correct?: boolean): ChoiceAnswer {
    const answer: ChoiceAnswer = {
        id: unit.id,
        text: getOptionValue(unit, options),
        correct: !!correct,
    };
    if (options.guess === "flag") {
        answer.imageURL = "/images/flag/" + unit.id + ".svg";
    } else if (options.guess === "coa") {
        answer.imageURL = "/images/coa/" + unit.id + ".svg";
    }
    return answer;
};

function getOptionValue(unit: Unit, options: GameOptions): string {
    if (options.guess === "name") {
        const prefix = (unit.type === "voivodeship")
            ? "województwo "
            : (unit.countyType === "city") ? "miasto " : "powiat ";
        return prefix + unit.name;
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
    const answer = question.answers.find((option) => option.id === answerId);
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
