import type { Unit } from "src/data/common";
import { units } from "src/data/units";
import { createActions, formatTitle, getQuestionText, getTextHint } from "src/game/common";
import { type GameOptions, InvalidGameOptionsError, matchesFilters } from "src/gameOptions";
import { hook } from "./store";
import type { GuessResult, TypingAnswer, TypingQuestion } from "./types";
import { toShuffled } from "src/utils/shuffle";

const { setOptions, startGame, resetGame, finishGame, togglePause, calculateTime } = createActions(hook);
export { calculateTime, resetGame, togglePause };

export function gameFromOptions(options: GameOptions) {
    setOptions(options);
    startGame();

    const filteredUnits = units
        .filter((unit) => unit.type === options.unitType && matchesFilters(unit, options.filters));
    const questions = getQuestions(filteredUnits, options);
    hook.setState({
        title: formatTitle(options),
        questions,
        answered: 0,
    });
}

/** Generates an array of questions about the provided administrative units. */
function getQuestions(units: Unit[], options: GameOptions): TypingQuestion[] {
    const questions = units.map((unit) => {
        const question: TypingQuestion = {
            id: unit.id,
            text: getQuestionText(unit, options),
            answers: getQuestionAnswers(unit, options),
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
    if (options.guessFrom === "flag" || options.guessFrom === "coa") {
        return toShuffled(questions);   // scramble questions so that you can't guess based on alphabetical order
    } else {
        // if guessing based on text, then the questions should be ordered alphabetically
        return questions.sort((a, b) => a.text!.localeCompare(b.text!));        // using sort with side effects
    }
}

function getQuestionAnswers(unit: Unit, options: GameOptions): TypingAnswer[] {
    return getQuestionAnswerStrings(unit, options).map((text) => ({
        id: unit.id,
        text,
        correct: true,
        guessed: false,
        slotIndex: -1,
    } satisfies TypingAnswer));
}

function getQuestionAnswerStrings(unit: Unit, options: GameOptions): string[] {
    if (options.guess === "name") {
        return [unit.name];
    } else if (options.guess === "capital") {
        return unit.capitals;
    } else if (options.guess === "plate") {
        return unit.plates;
    }
    throw new InvalidGameOptionsError();
}

/** Checks if the player's guess is correct.
 *  @throws if the game is unstarted, paused or finished
 *  @returns the result of this guess and, if the guess was incorrect and the required criteria were met,
 *  also returns a hint for the player. */
export function guess(questionId: string, playersGuess: string, slotIndex: number): [GuessResult, string | null] {
    const game = hook.getState();
    if (game.state !== "unpaused")
        throw new Error("Cannot perform this action while the game is unstarted, paused or finished.");

    const question = game.questions.find((question) => question.id === questionId);
    if (!question)
        throw new Error("Couldn't find question with the specified ID: " + questionId);

    const answer = question.answers
        .find((answer) => answer.text.toLowerCase() === playersGuess.toLowerCase());
    if (!answer) {      // a correct answer with this text doesn't exist
        const newQuestion: TypingQuestion = {
            ...question,
            tries: question.tries + 1,  // increase try counter
        };
        hook.setState({
            questions: game.questions
                .map((q) => (q.id === questionId) ? newQuestion : q),
        });
        const hint = getTextHint(newQuestion, game.options);
        return ["wrong", hint];
    }

    if (answer.guessed) {       // a correct answer with this text exist, but it was already provided
        return ["alreadyGuessed", null];
    } else {                    // a correct answer with this text exist
        const newAnswer: TypingAnswer = {
            ...answer,
            guessed: true,
            slotIndex,
        };
        const newQuestion: TypingQuestion = {
            ...question,
            answers: question.answers
                .map((ans) => (ans.text === answer.text) ? newAnswer : ans),
            provided: question.provided + 1,
        };
        hook.setState({
            questions: game.questions
                .map((q) => (q.id === question.id) ? newQuestion : q),
        });
        if (newQuestion.provided === question.answers.length) {
            hook.setState({
                // if all answers to this question have been provided,
                // then increase the answered question counter
                answered: game.answered + 1,
            });
            if (game.answered + 1 === game.questions.length) {
                finishGame();   // if all the questions have been answered, then finish the game
            }
        }
        return ["correct", null];
    }
}
