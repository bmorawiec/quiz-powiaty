import { preloadImage } from "src/utils/preloadImage";
import {
    type Answer,
    AnswerNotFoundError,
    type Answers,
    type GameAPIOptions,
    type Question,
    QuestionNotFoundError,
    type Questions,
} from "./types";

export async function preloadImages(qsAndAs: Questions & Answers, apiOptions: GameAPIOptions) {
    if (["flag", "coa"].includes(apiOptions.guessFrom) || ["flag", "coa"].includes(apiOptions.guess)) {
        const promises: Promise<void>[] = [];

        const questionIds = (apiOptions.preloadAllImages)
            ? qsAndAs.questionIds
            : qsAndAs.questionIds.slice(0, 2);

        for (const questionId of questionIds) {
            const question = qsAndAs.questions[questionId];
            if (!question)
                throw new QuestionNotFoundError(questionId);
            promises.push(...getImagePreloadPromises(question, qsAndAs.answers, apiOptions));
        }

        await Promise.all(promises);
    }
}

export function getImagePreloadPromises(
    question: Question,
    answers: Record<string, Answer | undefined>,
    apiOptions: GameAPIOptions,
): Promise<void>[] {
    const promises: Promise<void>[] = [];
    if (apiOptions.guessFrom === "flag" || apiOptions.guessFrom === "coa") {
        if (question.content.type !== "image")
            throw new Error("Expected question content type to be 'image'.");
        promises.push(preloadImage(question.content.url));
    }
    if (apiOptions.guess === "flag" || apiOptions.guessFrom === "coa") {
        for (const answerId of question.answerIds) {
            const answer = answers[answerId];
            if (!answer) throw new AnswerNotFoundError(answerId);
            if (answer.content.type !== "image")
                throw new Error("Expected answer content type to be 'image'.");
            promises.push(preloadImage(answer.content.url));
        }
    }
    return promises;
}
