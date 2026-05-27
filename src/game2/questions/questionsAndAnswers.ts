import type { Answers } from "./answers";
import type { Questions } from "./questions";

export function mergeQuestionsAndAnswers(a: Questions & Answers, b: Questions & Answers): Questions & Answers {
    return {
        questions: { ...a.questions, ...b.questions },
        questionIds: [...a.questionIds, ...b.questionIds],
        answers: { ...a.answers, ...b.answers },
        answerIds: [...a.answerIds, ...b.answerIds],
    };
}
