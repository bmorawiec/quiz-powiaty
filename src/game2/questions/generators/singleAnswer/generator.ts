import { getUnitProperties, type Property, type PropertyTag, type Unit } from "src/data";
import { toShuffled } from "src/utils/random";
import { rankAndPickBest } from "src/utils/rank";
import { ulid } from "ulid";
import type { Answer, Answers } from "../../answers";
import type { Content } from "../../content";
import { INITIAL_POINT_AMOUNT, type Question, type Questions } from "../../questions";
import { mergeQuestionsAndAnswers } from "../../questionsAndAnswers";

export interface GeneratorOptions {
    questions: {
        /** The generated questions will be about these units. */
        units: Unit[];
        /** A map containing properties of the provided units. Not all properties must be provided.
         *  Only properties with the tags specified in `tags` must be included. */
        properties: Record<string, Property>;
        /** Question content will be generated based on properties with these tags. */
        tags: PropertyTag[];
        /** A function that generates question content based on the properties of a unit.
         *  @param properties A list of properties all tagged with one of the tags specified in `questions.tags`. */
        contentGenerator: (properties: Property[]) => Content;
    };
    answers: {
        /** The generated incorrect answers will be about these units. */
        units: Unit[];
        /** A map containing properties of the provided units. Not all properties must be provided.
         *  Only properties with the tags specified in `tags` must be included. */
        properties: Record<string, Property>;
        /** Question content will be generated based on properties with these tags. */
        tags: PropertyTag[];
        /** A function that generates answer content based on the properties of a unit.
         *  @param properties A list of properties all tagged with one of the tags specified in `answers.tags`. */
        contentGenerator: (properties: Property[]) => Content;
        /** How many incorrect answers to generate. Must be a positive number.
         *  @throws If the value isn't positive. */
        howManyIncorrect: number;
        /** A function that ranks incorrect answers based on their properties.
         *  If a ranking function isn't provided, then answers will be picked at random. */
        rankIncorrect?: (questionProperties: Property[], answerProperties: Property[]) => number;
    };
}

/** Generates questions with a single correct answers, and a specified amount of incorrect answers. */
export function generateSingleAnswerQuestions(options: GeneratorOptions) {
    if (options.answers.howManyIncorrect <= 0) {
        throw new Error("Number of incorrect answers must be >= 0.");
    }

    let qsAndAs: Questions & Answers = {
        questions: {},
        questionIds: [],
        answers: {},
        answerIds: [],
    };

    const incorrectAnswerCandidates = options.answers.units
        .map((unit) => generateIncorrectAnswerCandidate(unit, options));
    for (const unit of options.questions.units) {
        const unitQsAndAs = generateQuestionAndItsAnswers(unit, incorrectAnswerCandidates, options);
        qsAndAs = mergeQuestionsAndAnswers(qsAndAs, unitQsAndAs);
    }

    return qsAndAs;
}

/** Generates a question about the provided unit.
 *  Also generates one correct answer and picks a number of incorrect answers from the ones provided.
 *  The number of incorrect answers picked depends on the options. */
export function generateQuestionAndItsAnswers(
    unit: Unit,
    incorrectAnswerCandidates: AnswerCandidate[],
    options: GeneratorOptions,
): Questions & Answers {
    const questionId = ulid();
    const questionProperties = getUnitProperties(unit, options.questions.properties)
        .filter((property) => options.questions.tags.includes(property.tag));

    const { answers, answerIds } = generateAnswers(
        unit,
        questionId,
        questionProperties,
        incorrectAnswerCandidates,
        options,
    );

    const question: Question = {
        id: questionId,
        content: options.questions.contentGenerator(questionProperties),
        points: INITIAL_POINT_AMOUNT,
        tries: 0,
        answerIds,
        numberGuessed: 0,
        numberCorrect: 1,
        guessed: false,
    };

    return {
        questions: { [questionId]: question },
        questionIds: [questionId],
        answers,
        answerIds,
    };
}

/** Generates a correct answer for the provided unit and picks the best incorrect answers from the ones provided.
 *  The number of incorrect answers picked depends on the options. */
export function generateAnswers(
    unit: Unit,
    questionId: string,
    questionProperties: Property[],
    incorrectAnswerCandidates: AnswerCandidate[],
    options: GeneratorOptions,
): Answers {
    const answers: Answers = {
        answers: {},
        answerIds: [],
    };

    const correctAnswer = generateCorrectAnswer(unit, questionId, options);
    answers.answers[correctAnswer.id] = correctAnswer;
    answers.answerIds.push(correctAnswer.id);

    // pick answers at random if a ranking function hasn't been provided
    const rank = options.answers.rankIncorrect || (() => Math.random());
    const bestIncorrectAnswers = rankAndPickBest(
        // remove the correct answer from the candidate list
        incorrectAnswerCandidates.filter((candidate) => candidate.unitId !== unit.id),
        options.answers.howManyIncorrect,
        (candidate: AnswerCandidate) => rank(questionProperties, candidate.properties),
    );
    for (const incorrectAnswer of bestIncorrectAnswers) {
        const filledInAnswer = incorrectAnswerFromCandidate(incorrectAnswer, questionId, options);
        answers.answers[filledInAnswer.id] = filledInAnswer;
        answers.answerIds.push(filledInAnswer.id);
    }

    answers.answerIds = toShuffled(answers.answerIds);

    return answers;
}

/** Converts an incorrect answer candidate to an incorrect answer. */
export function incorrectAnswerFromCandidate(
    candidate: AnswerCandidate,
    questionId: string,
    options: GeneratorOptions,
): Answer {
    return {
        id: ulid(),
        questionId,
        content: options.answers.contentGenerator(candidate.properties),
        correct: false,
        guessed: false,
    };
}

/** A candidate for an answer. */
interface AnswerCandidate {
    /** Id of the unit this answer is about. */
    unitId: string;
    /** The properties of the administrative unit this answer is about. */
    properties: Property[];
}

/** Creates a candidate for an incorrect answer based on the properties of the provided unit. */
export function generateIncorrectAnswerCandidate(unit: Unit, options: GeneratorOptions): AnswerCandidate {
    return {
        unitId: unit.id,
        properties: getUnitProperties(unit, options.answers.properties)
            .filter((property) => options.answers.tags.includes(property.tag)),
    };
}

/** Creates a single correct answer for the provided unit. */
export function generateCorrectAnswer(unit: Unit, questionId: string, options: GeneratorOptions): Answer {
    return {
        id: ulid(),
        questionId,
        content: options.answers.contentGenerator(getUnitProperties(unit, options.answers.properties)
            .filter((property) => options.answers.tags.includes(property.tag))),
        correct: true,
        guessed: false,
    };
}
