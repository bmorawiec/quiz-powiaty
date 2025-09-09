import type { Unit } from "src/data/common";
import { units } from "src/data/units";
import { matchesFilters, type GameOptions } from "src/gameOptions";
import { preloadImage } from "src/utils/preloadImage";
import { toShuffled } from "src/utils/shuffle";
import { createActions, formatQuestion } from "../../common";
import { plausibleAnswerUnits } from "./plausibleAnswers";
import { hook } from "./store";
import type { ChoiceAnswer, ChoiceQuestion, GuessResult } from "./types";

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

    const matchingUnits = units.filter((unit) => unit.type === options.unitType);
    const filteredUnits = matchingUnits.filter((unit) => matchesFilters(unit, options.filters));
    const questions = getQuestions(filteredUnits, matchingUnits, options);
    if (options.guessFrom === "flag" || options.guessFrom === "coa") {
        const firstTwoQuestions = questions.slice(0, 2);
        // preload flags/COAs for the first two prompts
        await Promise.all(firstTwoQuestions.map((prompt) => preloadImage(prompt.imageURL!)));
    } else if (options.guess === "flag" || options.guess === "coa") {
        const firstTwoQuestions = questions.slice(0, 2);
        // preload flags/COAs for answers of the first two prompts
        await Promise.all(firstTwoQuestions.map((prompt) =>
            Promise.all(prompt.answers.map((answer) => answer.imageURL))));
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
            answers: getAnswers(unit, allUnits, options),
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

function getAnswers(unit: Unit, allUnits: Unit[], options: GameOptions): ChoiceAnswer[] {
    const answers: ChoiceAnswer[] = plausibleAnswerUnits(unit, allUnits, options)
        .map((unit) => getAnswerFromUnit(unit, options));

    // randomly choose five incorrect answers
    while (answers.length < 5) {
        const randomIndex = Math.floor(Math.random() * allUnits.length);
        const incorrectUnit = allUnits[randomIndex];
        if (incorrectUnit !== unit && !answers.some((option) => option.id === incorrectUnit.id)) {
            answers.push(getAnswerFromUnit(incorrectUnit, options));
        }
    }

    // add correct answer to array of answers
    answers.push(getAnswerFromUnit(unit, options, true));

    return toShuffled(answers);
}

function getAnswerFromUnit(unit: Unit, options: GameOptions, correct?: boolean): ChoiceAnswer {
    const answer: ChoiceAnswer = {
        id: unit.id,
        correct: !!correct,
    };
    if (options.guess === "flag") {
        answer.imageURL = "/images/flag/" + unit.id + ".svg";
    } else if (options.guess === "coa") {
        answer.imageURL = "/images/coa/" + unit.id + ".svg";
    } else {
        answer.text = getAnswerText(unit, options);
    }
    return answer;
};

function getAnswerText(unit: Unit, options: GameOptions): string {
    if (options.guess === "name") {
        const prefix = (unit.type === "voivodeship")
            ? "województwo "
            : (unit.countyType === "city") ? "miasto " : "powiat ";
        return prefix + unit.name;
    } else if (options.guess === "capital") {
        return unit.capitals.join(", ");
    } else if (options.guess === "plate") {
        return unit.plates.join(", ");
    }
    throw Error("Text not defined for the provided game options.");
}

/** Checks if the player's guess is correct. If it was, then proceeds to the next question.
 *  @throws if the game is unstarted, starting, paused or finished. */
export function guess(answerId: string): GuessResult {
    const game = hook.getState();
    if (game.state !== "unpaused")
        throw new Error("Cannot perform this action while the game is unstarted, paused or finished.");

    const question = game.questions[game.current];
    const answer = question.answers.find((answer) => answer.id === answerId);
    if (!answer)
        throw new Error("Cannot find answer with the specified ID: " + answerId);
    const result = (answer.correct) ? "correct" : "wrong";

    if (result === "correct") {
        // proceed to the next question
        hook.setState({
            current: game.current + 1,
            answered: game.answered + 1,
        });
        if (game.answered + 1 === game.questions.length) {
            finishGame();       // finish game if all questions have been answered
        } else if (game.current + 2 < game.questions.length) {
            if (game.options.guessFrom === "flag" || game.options.guessFrom === "coa") {
                const nextNextQuestion = game.questions[game.current + 2];
                preloadImage(nextNextQuestion.imageURL!);       // preload image for soon-to-be next question
            } else if (game.options.guess === "flag" || game.options.guess === "coa") {
                const nextNextQuestion = game.questions[game.current + 2];
                for (const answer of nextNextQuestion.answers) {
                    preloadImage(answer.imageURL!);     // preload images for answers of soon-to-be next question
                }
            }
        }
    } else {
        hook.setState({
            questions: game.questions.map((question, index) => (index === game.current) ? {
                ...question,
                tries: question.tries + 1,        // if the provided answer was wrong, then increase the try counter
            } : question),
        });
    }

    return result;
}
