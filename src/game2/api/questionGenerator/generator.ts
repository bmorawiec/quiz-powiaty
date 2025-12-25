import { type Unit } from "src/data/common";
import { toShuffled } from "src/utils/random";
import { ulid } from "ulid";
import {
    AnswerNotFoundError,
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
    const correct = getCorrectAnswers(unit, apiOptions, questionId);
    const incorrect = getIncorrectAnswers(apiOptions, questionId, correct);
    return {
        answers: { ...correct.answers, ...incorrect.answers },
        answerIds: toShuffled([...correct.answerIds, ...incorrect.answerIds]),
        numberCorrect: correct.answerIds.length,
    };
}

export function getCorrectAnswers(unit: Unit, apiOptions: GameAPIOptions, questionId: string): Answers {
    const result: Answers = {
        answers: {},
        answerIds: [],
    };

    let contentArray = getAnswerContents(unit, apiOptions);
    if (apiOptions.squishAnswers && ["name", "capital", "plate"].includes(apiOptions.guess)) {
        contentArray = [squishTextAnswerContent(contentArray as TextAnswerContent[])];
    }
    for (const content of contentArray) {
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
    }

    return result;
}

function getIncorrectAnswers(apiOptions: GameAPIOptions, questionId: string, correct: Answers): Answers {
    const result: Answers = {
        answers: {},
        answerIds: [],
    };
    if (!apiOptions.numberOfAnswers) {
        return result;
    }

    while (correct.answerIds.length + result.answerIds.length < apiOptions.numberOfAnswers) {
        const randomIndex = Math.floor(Math.random() * apiOptions.allUnits.length);
        const incorrectUnit = apiOptions.allUnits[randomIndex];
        if (hasDuplicate(incorrectUnit, correct) || hasDuplicate(incorrectUnit, result)) {
            continue;
        }

        let contentArray = getAnswerContents(incorrectUnit, apiOptions);
        if (apiOptions.squishAnswers && ["name", "capital", "plate"].includes(apiOptions.guess)) {
            contentArray = [squishTextAnswerContent(contentArray as TextAnswerContent[])];
        }

        let contentIndex = 0;
        while (correct.answerIds.length + result.answerIds.length < apiOptions.numberOfAnswers
            && contentIndex < contentArray.length) {
            const content = contentArray[contentIndex];

            const answer: Answer = {
                id: ulid(),
                questionId,
                unitId: incorrectUnit.id,
                content,
                correct: false,
                guessed: false,
            };
            result.answerIds.push(answer.id);
            result.answers[answer.id] = answer;

            contentIndex++;
        }
    }

    return result;
}

function hasDuplicate(unit: Unit, answers: Answers) {
    return answers.answerIds.some((answerId) => {
        const answer = answers.answers[answerId];
        if (!answer)
            throw new AnswerNotFoundError(answerId);
        return answer.unitId === unit.id;
    });
}
