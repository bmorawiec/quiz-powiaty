import { preloadImage } from "src/utils/preloadImage";
import { AnswerNotFoundError, type Answers, type GameAPIOptions, type Question, QuestionNotFoundError, type Questions } from "./types";

export async function preloadImages(qsAndAs: Questions & Answers, apiOptions: GameAPIOptions) {
    if (apiOptions.guessFrom === "flag" || apiOptions.guessFrom === "coa") {
        const questionIds = (apiOptions.preloadAllImages)
            ? qsAndAs.questionIds
            : qsAndAs.questionIds.slice(0, 2);

        await Promise.all(questionIds.flatMap((questionId) => {
            const question = qsAndAs.questions[questionId];
            if (!question) throw new QuestionNotFoundError(questionId);
            return [
                ...getAnswerImagePromises(question, qsAndAs, apiOptions),
                preloadImage(question.imageURL)
            ];
        }));
    }
}

function getAnswerImagePromises(question: Question, qsAndAs: Questions & Answers, apiOptions: GameAPIOptions) {
    if (apiOptions.guess === "flag" || apiOptions.guess === "coa") {
        return question.answerIds.map((answerId) => {
            const answer = qsAndAs.answers[answerId];
            if (!answer) throw new AnswerNotFoundError(answerId);

            return preloadImage(answer.imageURL);
        });
    } else {
        return [];
    }
}
