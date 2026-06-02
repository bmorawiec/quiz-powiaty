import { getUnitProperties, type Property, type PropertyTag, type Unit } from "src/data";
import { ulid } from "ulid";
import type { Answer, Answers } from "../../answers";
import type { ContentGenerator } from "../../content";
import type { Question, Questions } from "../../questions";
import { INITIAL_POINT_AMOUNT, QuestionNotFoundError } from "../../questions";
import { mergeQuestionsAndAnswers } from "../../questionsAndAnswers";

export interface GeneratorOptions {
    /** The generated questions will be about these units. */
    units: Unit[];
    /** A map containing properties of the provided units. Not all properties must be provided.
     *  Only properties with the tags specified in `question.tags` and `answers.tag` must be included. */
    properties: Record<string, Property>;
    questions: {
        tags: PropertyTag[];
        /** A function that generates question content based on the properties of a unit.
         *  @param properties A list of properties all tagged with one of the tags specified in `questions.tags`. */
        contentGenerator: ContentGenerator;
        /** If provided, then the generated questions will be sorted using this sorter. */
        sorter?: (a: Question, b: Question) => number;
    };
    answers: {
        tags: PropertyTag[];
        /** A function that generates question answer based on the properties of a unit.
         *  @param property A property tagged with the tag specified in `answers.tag`. */
        contentGenerator: ContentGenerator,
    };
}

/** Generates questions with multiple correct answers. */
export function generateMultipleAnswerQuestions(options: GeneratorOptions): Questions & Answers {
    let qsAndAs: Questions & Answers = {
        questions: {},
        questionIds: [],
        answers: {},
        answerIds: [],
    };

    for (const unit of options.units) {
        const unitQsAndAs = generateQuestionAndItsAnswers(unit, options);
        qsAndAs = mergeQuestionsAndAnswers(qsAndAs, unitQsAndAs);
    }

    if (options.questions.sorter) {
        qsAndAs.questionIds.sort((idA, idB) => {
            const questionA = qsAndAs.questions[idA];
            const questionB = qsAndAs.questions[idB];
            if (!questionA) throw new QuestionNotFoundError(idA);
            if (!questionB) throw new QuestionNotFoundError(idB);
            return options.questions.sorter!(questionA, questionB);
        });
    }

    return qsAndAs;
}

/** Generates a question about the provided unit. Also generates the correct answers to that question. */
export function generateQuestionAndItsAnswers(unit: Unit, options: GeneratorOptions): Questions & Answers {
    const questionId = ulid();
    const { answers, answerIds } = generateCorrectAnswers(unit, questionId, options);
    const question: Question = {
        id: questionId,
        content: options.questions.contentGenerator(getUnitProperties(unit, options.properties)
            .filter((property) => options.questions.tags.includes(property.tag))),
        points: INITIAL_POINT_AMOUNT,
        tries: 0,
        answerIds,
        numberGuessed: 0,
        numberCorrect: answerIds.length,
        guessed: false,
    };

    return {
        questions: { [questionId]: question },
        questionIds: [questionId],
        answers,
        answerIds,
    };
}

/** Generates correct answers to a question about the provided unit. */
export function generateCorrectAnswers(unit: Unit, questionId: string, options: GeneratorOptions): Answers {
    const answers: Answers = {
        answers: {},
        answerIds: [],
    };

    const answerProperties = getUnitProperties(unit, options.properties)
        .filter((property) => options.answers.tags.includes(property.tag));
    for (const property of answerProperties) {
        const answer: Answer = {
            id: ulid(),
            questionId,
            content: options.answers.contentGenerator([property]),
            correct: true,
            guessed: false,
        };
        answers.answers[answer.id] = answer;
        answers.answerIds.push(answer.id);
    }

    return answers;
}
