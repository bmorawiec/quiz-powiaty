import { getUnitProperties, type Property, type PropertyTag, type Unit } from "src/data";
import { ulid } from "ulid";
import type { Answer, Answers } from "../../answers";
import type { Question, Questions } from "../../questions";
import { INITIAL_POINT_AMOUNT, QuestionNotFoundError } from "../../questions";
import { mergeQuestionsAndAnswers } from "../../questionsAndAnswers";

export interface GeneratorOptions {
    /** The generated questions will be about these units. */
    units: Unit[];
    /** A map containing properties of the provided units. Not all properties must be provided.
     *  Only properties with the tags specified in `question.tag` and `answers.tag` must be included. */
    properties: Record<string, Property>;
    questions: {
        /** Question content will be generated based on properties with this tag. */
        tag: PropertyTag;
        /** A function that replaces properties just before they are converted to content.
         *  Used to change the phrasing of questions or add labels to image content. */
        replacer?: (properties: Property[]) => Property[];
        /** If set to true, then the returned questions will be sorted in alphabetical order. This requires at least one
         *  content of type 'text' to be present in the generated questions.
         *  If set to false, then questions are returned in the same order as their corresponding units in the
         *  `units` array.
         *  @default false */
        sort?: boolean;
    };
    answers: {
        /** Answer content will be generated based on properties with this tag. */
        tag: PropertyTag;
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

    if (options.questions.sort) {
        qsAndAs.questionIds.sort((a: string, b: string) => {
            const questionA = qsAndAs.questions[a];
            const questionB = qsAndAs.questions[b];
            if (!questionA) throw new QuestionNotFoundError(a);
            if (!questionB) throw new QuestionNotFoundError(b);

            const textContentA = questionA.contents.find((content) => content.type === "text");
            const textContentB = questionB.contents.find((content) => content.type === "text");
            if (!textContentA || !textContentB) {
                throw new Error("The provided questions must contain text.");
            }

            return textContentA.text.localeCompare(textContentB.text);
        });
    }

    return qsAndAs;
}

/** Generates a question about the provided unit. Also generates the correct answers to that question. */
export function generateQuestionAndItsAnswers(unit: Unit, options: GeneratorOptions): Questions & Answers {
    const questionId = ulid();
    const replacer = options.questions.replacer || ((properties: Property[]) => properties);

    const { answers, answerIds } = generateCorrectAnswers(unit, questionId, options);

    const question: Question = {
        id: questionId,
        contents: replacer(getUnitProperties(unit, options.properties)
            .filter((property) => property.tag === options.questions.tag)),
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
        .filter((property) => property.tag.includes(options.answers.tag));
    for (const property of answerProperties) {
        const answer: Answer = {
            id: ulid(),
            questionId,
            contents: [property],
            correct: true,
            guessed: false,
        };
        answers.answers[answer.id] = answer;
        answers.answerIds.push(answer.id);
    }

    return answers;
}
