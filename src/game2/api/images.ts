import {
    AnswerNotFoundError,
    QuestionNotFoundError,
    retrieveImageURL,
    type Answer,
    type Answers,
    type Question,
    type Questions,
} from "src/game2/questions";
import { preloadImage } from "src/utils/preloadImage";
import { type GameAPIOptions } from "./types";

/** If the `preloadAllImages` API options is set, then preloads images for all the questions and their answers.
 *  Otherwise preloads images for the first two questions and their answers. */
export async function preloadImages(qsAndAs: Questions & Answers, apiOptions: GameAPIOptions) {
    // all promises are held in this array so that they can be fetched in parallel
    const promises: Promise<void>[] = [];

    const questionIds = (apiOptions.preloadAllImages)
        ? qsAndAs.questionIds
        : qsAndAs.questionIds.slice(0, 2);

    for (const questionId of questionIds) {
        const question = qsAndAs.questions[questionId];
        if (!question)
            throw new QuestionNotFoundError(questionId);
        promises.push(...getImagePreloadPromises(question, qsAndAs.answers));
    }

    await Promise.all(promises);
}

export function getImagePreloadPromises(
    question: Question,
    answers: Record<string, Answer | undefined>,
): Promise<void>[] {
    const promises: Promise<void>[] = [];

    const questionImageURL = retrieveImageURL(question.content);
    if (questionImageURL) {
        promises.push(preloadImage(questionImageURL));
    }

    for (const answerId of question.answerIds) {
        const answer = answers[answerId];
        if (!answer) throw new AnswerNotFoundError(answerId);

        const answerImageURL = retrieveImageURL(answer.content);
        if (answerImageURL) {
            promises.push(preloadImage(answerImageURL));
        }
    }

    return promises;
}
