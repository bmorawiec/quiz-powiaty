import { AnswerNotFoundError, QuestionNotFoundError, type Answer, type Question } from "src/game2/questions";
import type { ZustandGetter, ZustandSetter } from "src/utils/zustand";
import { getImagePreloadPromises } from "./images";
import { type GameAPI, type GameAPIActions } from "./types";

export function createGameAPIActions(set: ZustandSetter<GameAPI>, get: ZustandGetter<GameAPI>): GameAPIActions {
    function togglePause() {
        if (get().state === "finished")
            throw new Error("Cannot pause or unpause a finished game.");

        set((api) => ({
            state: (api.state === "paused") ? "unpaused" : "paused",
            timestamps: [...api.timestamps, Date.now()],
        }));
    }

    function calculateTime() {
        let time = 0;
        const timestamps = (get().state === "unpaused")
            ? [...get().timestamps, Date.now()]
            : get().timestamps;
        for (let index = 0; index < timestamps.length; index += 2) {
            const unpausedAt = timestamps[index];
            const pausedAt = timestamps[index + 1];

            const timeDiff = pausedAt - unpausedAt;
            time += timeDiff;
        }

        return time;
    }

    function restart() {
        get().options.onRestart();
    }

    function toggleFullscreen() {
        get().options.onToggleFullscreen();
    }

    function correctGuess(answerId: string) {
        if (get().state !== "unpaused")
            throw new Error("This action can only be performed while the game is unpaused.");

        const answer = get().answers[answerId];
        if (!answer) throw new AnswerNotFoundError(answerId);
        if (answer.guessed)
            throw new Error("Cannot mark an answer that has already been guessed as guessed.");
        if (!answer.correct)
            throw new Error("Cannot mark an incorrect answer as guessed.");

        const question = get().questions[answer.questionId];
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


        set((api) => ({
            answers: {
                ...api.answers,
                [answerId]: newAnswer,
            },
            questions: {
                ...api.questions,
                [answer.questionId]: newQuestion,
            },
        }));

        if (newQuestion.guessed) {
            set((api) => ({
                numberGuessed: api.numberGuessed + 1,   // update guessed question count if all answers guessed
                points: api.points + question.points,   // also update point counter
            }));

            if (get().numberGuessed >= get().questionIds.length) {
                finish();   // finish game if all the questions have been guessed
            }
        }

        return newQuestion.guessed;
    }

    /** Sets the API's state to "finished" and updates timestamps. */
    function finish() {
        set({
            state: "finished",
            timestamps: [...get().timestamps, Date.now()],
        });
    }

    function incorrectGuess(questionId: string) {
        if (get().state !== "unpaused")
            throw new Error("This action can only be performed while the game is unpaused.");

        const question = get().questions[questionId];
        if (!question) throw new AnswerNotFoundError(questionId);
        if (question.guessed)
            throw new Error("Action can't be performed on a question that has been guessed.");

        set((api) => ({
            questions: {
                ...api.questions,
                [questionId]: {
                    ...question,
                    points: (question.points <= 0) ? 0 : question.points - 1,
                    tries: question.tries + 1,
                },
            },
        }));
    }

    async function preloadImages(questionId: string) {
        const question = get().questions[questionId];
        if (!question) throw new QuestionNotFoundError(questionId);

        await Promise.all(getImagePreloadPromises(question, get().answers));
    }

    return { togglePause, calculateTime, restart, toggleFullscreen, correctGuess, incorrectGuess, preloadImages };
}
