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
    type TextQuestionContent,
} from "../types";
import { getAnswerContents, squishTextAnswerContent } from "./answerContent";
import { getQuestionContent } from "./questionContent";

/** Generates questions and answers based on the provided API options. */
export function getQuestionsAndAnswers(apiOptions: GameAPIOptions): Questions & Answers {
    const result: Questions & Answers = {
        questions: {},
        questionIds: [],
        answers: {},
        answerIds: [],
    };

    // generate a question for each of the provided administrative units
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

    // sort questions alphabetically if specified in the options
    // and the questions can be sorted (question content must be of type "text").
    if (["name", "capital", "plate"].includes(apiOptions.guessFrom) && apiOptions.sortQuestions) {
        result.questionIds.sort((idA, idB) => {     // potential source of confusion: this is an in-place sort
            const questionA = result.questions[idA];
            if (!questionA) throw new QuestionNotFoundError(idA);

            const questionB = result.questions[idB];
            if (!questionB) throw new QuestionNotFoundError(idB);

            return (questionA.content as TextQuestionContent).shortText
                .localeCompare((questionB.content as TextQuestionContent).shortText);
        });
    }
    return result;
}

/** Returns answers to a question about the provided unit. */
function getAnswers(unit: Unit, apiOptions: GameAPIOptions, questionId: string): Answers & { numberCorrect: number } {
    const correct = getCorrectAnswers(unit, apiOptions, questionId);
    const incorrect = getIncorrectAnswers(apiOptions, questionId, correct);
    return {
        answers: { ...correct.answers, ...incorrect.answers },
        answerIds: toShuffled([...correct.answerIds, ...incorrect.answerIds]),
        numberCorrect: correct.answerIds.length,    // how many of the generated answers are correct ones
    };
}

/** Returns correct answers to a question about the provided unit. */
export function getCorrectAnswers(unit: Unit, apiOptions: GameAPIOptions, questionId: string): Answers {
    const result: Answers = {
        answers: {},
        answerIds: [],
    };

    let contentArray = getAnswerContents(unit, apiOptions);
    if (apiOptions.squishAnswers && ["name", "capital", "plate"].includes(apiOptions.guess)) {
        // (see API options docs for how squishing answers works)
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

/** Returns incorrect answers to a question about the provided unit.
 *  The number of answers returned depends on how many correct answers were already generated and the `numberOfAnswers`
 *  API option. */
function getIncorrectAnswers(apiOptions: GameAPIOptions, questionId: string, correct: Answers): Answers {
    const result: Answers = {
        answers: {},
        answerIds: [],
    };
    if (!apiOptions.numberOfAnswers) {
        return result;  // return empty result object if no incorrect answers expected
    }

    while (correct.answerIds.length + result.answerIds.length < apiOptions.numberOfAnswers) {
        const randomIndex = Math.floor(Math.random() * apiOptions.allUnits.length);
        const incorrectUnit = apiOptions.allUnits[randomIndex];     // pick a random unit for the incorrect answer
        if (hasDuplicate(incorrectUnit, correct) || hasDuplicate(incorrectUnit, result)) {
            continue;   // pick another unit if this one has already been used
        }

        // get answer contents to generate
        let contentArray = getAnswerContents(incorrectUnit, apiOptions);
        if (apiOptions.squishAnswers && ["name", "capital", "plate"].includes(apiOptions.guess)) {
            // (see API options docs for how squishing answers works)
            contentArray = [squishTextAnswerContent(contentArray as TextAnswerContent[])];
        }

        let contentIndex = 0;
        // add answers until the limit from the API options is reached or we run out of answer contents
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

/** Returns true if `answers` contains an answer generated from the provided unit. */
function hasDuplicate(unit: Unit, answers: Answers) {
    return answers.answerIds.some((answerId) => {
        const answer = answers.answers[answerId];
        if (!answer)
            throw new AnswerNotFoundError(answerId);
        return answer.unitId === unit.id;
    });
}
