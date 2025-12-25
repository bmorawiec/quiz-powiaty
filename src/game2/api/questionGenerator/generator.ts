import { type Unit } from "src/data/common";
import { toShuffled } from "src/utils/random";
import { ulid } from "ulid";
import {
    QuestionNotFoundError,
    type Answer,
    type Answers,
    type GameAPIOptions,
    type Question,
    type Questions,
    type TextAnswerContent,
} from "../types";
import { getAnswerContents, squishTextAnswerContent } from "./answerContent";
import { getQuestionContent } from "./questionContent";

export function getQuestionsAndAnswers(apiOptions: GameAPIOptions): Questions & Answers {
    const result: Questions & Answers = {
        questions: {},
        questionIds: [],
        answers: {},
        answerIds: [],
    };

    for (const unit of apiOptions.units) {
        const questionId = ulid();

        const { answers, answerIds, numberCorrect } = getAnswers(unit, apiOptions, questionId);
        result.answers = { ...result.answers, ...answers };
        result.answerIds.push(...answerIds);

        const question: Question = {
            id: questionId,
            unitId: unit.id,
            content: getQuestionContent(unit, apiOptions),
            points: 4,
            tries: 0,
            answerIds,
            numberGuessed: 0,
            numberCorrect,
            guessed: false,
        };
        result.questionIds.push(questionId);
        result.questions[questionId] = question;
    }

    if (apiOptions.sortQuestions) {
        result.questionIds.sort((idA, idB) => {
            const questionA = result.questions[idA];
            if (!questionA) throw new QuestionNotFoundError(idA);

            const questionB = result.questions[idB];
            if (!questionB) throw new QuestionNotFoundError(idB);

            return questionA.content.shortText.localeCompare(questionB.content.shortText);
        });
    }
    return result;
}

function getAnswers(unit: Unit, apiOptions: GameAPIOptions, questionId: string): Answers & { numberCorrect: number } {
    const result: Answers & { numberCorrect: number } = {
        answers: {},
        answerIds: [],
        numberCorrect: 0,
    };

    let correctAnswerContents = getAnswerContents(unit, apiOptions);
    if (apiOptions.squishAnswers && ["name", "capital", "plate"].includes(apiOptions.guess)) {
        correctAnswerContents = [squishTextAnswerContent(correctAnswerContents as TextAnswerContent[])];
    }
    for (const content of correctAnswerContents) {
        const answer: Answer = {
            id: ulid(),
            questionId,
            unitId: unit.id,
            content,
            correct: true,
            guessed: false,
        };
        result.answerIds.push(answer.id);
        result.answers[answer.id] = answer;
        result.numberCorrect++;
    }

    result.answerIds = toShuffled(result.answerIds);
    return result;
}
