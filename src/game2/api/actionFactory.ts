import type { ZustandGetter, ZustandSetter } from "src/utils/zustand";
import {
    AnswerNotFoundError,
    type Answer,
    type GameAPI,
    type GameAPIActions,
    type Question,
} from "./types";

const TRIES_FOR_HINT = 1;
const TRIES_FOR_FULL_HINT = 6;

export function createGameAPIActions(set: ZustandSetter<GameAPI>, get: ZustandGetter<GameAPI>): GameAPIActions {
    function togglePause() {
        const api = get();
        if (api.state === "finished")
            throw new Error("Cannot pause or unpause a finished game.");

        set({
            state: (api.state === "paused") ? "unpaused" : "paused",
            timestamps: [...api.timestamps, Date.now()],
        });
    }

    function calculateTime() {
        const game = get();

        let time = 0;
        const timestamps = (game.state === "unpaused")
            ? [...game.timestamps, Date.now()]
            : game.timestamps;
        for (let index = 0; index < timestamps.length; index += 2) {
            const unpausedAt = timestamps[index];
            const pausedAt = timestamps[index + 1];

            const timeDiff = pausedAt - unpausedAt;
            time += timeDiff;
        }

        return time;
    }

    function correctGuess(answerId: string) {
        const api = get();

        const answer = api.answers[answerId];
        if (!answer) throw new AnswerNotFoundError(answerId);
        if (answer.guessed)
            throw new Error("Cannot mark an answer that has already been guessed as guessed.");
        if (!answer.correct)
            throw new Error("Cannot mark an incorrect answer as guessed.");

        const question = api.questions[answer.questionId];
        if (!question) throw new AnswerNotFoundError(answer.questionId);

        const newAnswer: Answer = {
            ...answer,
            guessed: true,
        };
        const newQuestion: Question = {
            ...question,
            numberGuessed: question.numberGuessed + 1,
            // mark question guessed if all the answers have been guessed
            guessed: question.numberGuessed + 1 >= question.numberCorrect,
        };

        // update guessed question count if all the answers have been guessed
        const newNumberGuessed = (newQuestion.guessed) ? api.numberGuessed + 1 : api.numberGuessed;

        set({
            answers: {
                ...api.answers,
                [answerId]: newAnswer,
            },
            questions: {
                ...api.questions,
                [answer.questionId]: newQuestion,
            },
            numberGuessed: newNumberGuessed,
        });

        if (newNumberGuessed >= api.questionIds.length) {
            finish();   // finish game if all the questions have been guessed
        }

        return newQuestion.guessed;
    }

    function finish() {
        const api = get();
        set({
            state: "finished",
            timestamps: [...api.timestamps, Date.now()],
        });
    }

    function incorrectGuess(questionId: string) {
        const api = get();

        const question = api.questions[questionId];
        if (!question) throw new AnswerNotFoundError(questionId);

        set({
            questions: {
                ...api.questions,
                [questionId]: {
                    ...question,
                    points: (question.points <= 0) ? 0 : question.points - 1,
                },
            },
        });

        return (api.options.provideHints)
            ? getFullHint(question) || getPartialHint(question)
            : null;
    }

    function getFullHint(question: Question): string | null {
        if (question.tries <= TRIES_FOR_FULL_HINT) {
            return null;
        }

        const api = get();
        return question.answerIds.map((answerId) => {
            const answer = api.answers[answerId];
            if (!answer) throw new AnswerNotFoundError(answerId);
            if (answer.content.type !== "text")
                throw new Error("Expected answer content type to be 'text'.");

            return answer.content.shortText;
        }).join(", ");
    }

    function getPartialHint(question: Question): string | null {
        if (question.tries <= TRIES_FOR_HINT) {
            return null;
        }

        const api = get();
        const noOfLetters = question.tries - TRIES_FOR_HINT + 1;      // how many letters to uncover
        return question.answerIds.map((answerId) => {
            const answer = api.answers[answerId];
            if (!answer) throw new AnswerNotFoundError(answerId);
            if (answer.content.type !== "text")
                throw new Error("Expected answer content type to be 'text'.");

            let hint = "";
            for (let index = 0; index < answer.content.shortText.length; index++) {
                const char = answer.content.shortText[index];
                if (char === " " || char === "-"
                    || index < noOfLetters      // uncover first n letters
                    || (answer.content.shortText.length > 3     // also uncover last n letters
                        && index >= answer.content.shortText.length - noOfLetters)) {
                    hint += char;
                } else {
                    hint += "*";
                }
            }
            return hint;
        }).join(", ");
    }

    return { togglePause, calculateTime, correctGuess, incorrectGuess };
}
