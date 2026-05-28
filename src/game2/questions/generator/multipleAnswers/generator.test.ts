import type { Property, Unit } from "src/data";
import { getUnitProperties } from "src/data";
import { describe, expect, it } from "vitest";
import { INITIAL_POINT_AMOUNT } from "../../questions";
import {
    generateCorrectAnswers,
    generateMultipleAnswerQuestions,
    generateQuestionAndItsAnswers,
    type GeneratorOptions
} from "./generator";

const unit1: Unit = {
    id: "1",
    tags: ["landCounty"],
    propertyIds: ["name1", "unambiguousName1", "shortName1", "capital1", "plate1a", "plate1b",
        "flag1", "coa1", "shape1"],
};
const name1: Property = { tag: "name", type: "text", text: "powiat rzeszowski" };
const capital1: Property = { tag: "capital", type: "text", text: "Rzeszów" };
const plate1a: Property = { tag: "plate", type: "text", text: "RZE" };
const plate1b: Property = { tag: "plate", type: "text", text: "RZZ" };
const flag1: Property = { tag: "flag", type: "image", url: "/dummy-path/1.svg" };

const unit2: Unit = {
    id: "2",
    tags: ["landCounty"],
    propertyIds: ["name2", "unambiguousName2", "shortName2", "capital2", "plate2",
        "flag2", "coa2", "shape2"],
};
const name2: Property = { tag: "name", type: "text", text: "powiat dębicki" };
const capital2: Property = { tag: "capital", type: "text", text: "Dębica" };
const plate2: Property = { tag: "plate", type: "text", text: "RDE" };
const flag2: Property = { tag: "flag", type: "image", url: "/dummy-path/2.svg" };

const unit3: Unit = {
    id: "3",
    tags: ["landCounty"],
    propertyIds: ["name3", "unambiguousName3", "shortName3", "capital3", "plate3a", "plate3b",
        "flag3", "coa3", "shape3"],
};
const name3: Property = { tag: "name", type: "text", text: "powiat krośnieński" };
const capital3: Property = { tag: "capital", type: "text", text: "Krosno" };
const plate3a: Property = { tag: "plate", type: "text", text: "RKR" };
const plate3b: Property = { tag: "plate", type: "text", text: "YKR" };
const flag3: Property = { tag: "flag", type: "image", url: "/dummy-path/3.svg" };

const unit4: Unit = {
    id: "4",
    tags: ["cityCounty"],
    propertyIds: ["name4", "unambiguousName4", "shortName4", "capital4", "plate4",
        "flag4", "coa4", "shape4"],
};
const name4: Property = { tag: "name", type: "text", text: "miasto Krosno" };
const capital4: Property = { tag: "capital", type: "text", text: "Krosno" };
const plate4: Property = { tag: "plate", type: "text", text: "RK" };
const flag4: Property = { tag: "flag", type: "image", url: "/dummy-path/4.svg" };

const units: Unit[] = [unit1, unit2, unit3, unit4];

const properties: Record<string, Property> = {
    name1,
    capital1,
    plate1a,
    plate1b,
    flag1,
    name2,
    capital2,
    plate2,
    flag2,
    name3,
    capital3,
    plate3a,
    plate3b,
    flag3,
    name4,
    capital4,
    plate4,
    flag4,
};

describe("generateMultipleAnswerQuestions", () => {
    it("generates the correct amount of questions and answers, in the right order", () => {
        const options: GeneratorOptions = {
            units,
            properties,
            questions: { tag: "name" },
            answers:  { tag: "plate" },
        };

        const qsAndAs = generateMultipleAnswerQuestions(options);
        expect(qsAndAs.questionIds.length).toBe(4);    // expecting 4 questions to be generated

        // checking if the order of the questions is the same as in the input
        // no in-depth verification of the structure of the generated questions or answers
        const question1 = qsAndAs.questions[qsAndAs.questionIds[0]]!;
        expect(question1).toMatchObject({
            contents: [{ type: "text", text: "powiat rzeszowski" }],
        });

        const question2 = qsAndAs.questions[qsAndAs.questionIds[1]]!;
        expect(question2).toMatchObject({
            contents: [{ type: "text", text: "powiat dębicki" }],
        });

        const question3 = qsAndAs.questions[qsAndAs.questionIds[2]]!;
        expect(question3).toMatchObject({
            contents: [{ type: "text", text: "powiat krośnieński" }],
        });

        const question4 = qsAndAs.questions[qsAndAs.questionIds[3]]!;
        expect(question4).toMatchObject({
            contents: [{ type: "text", text: "miasto Krosno" }],
        });

        expect(qsAndAs.answerIds.length).toBe(6);   // expecting 6 answers to be generated

        // checking if the order of the questions is the same as in the input
        // no in-depth verification of the structure of the generated questions or answers
        const answer1 = qsAndAs.answers[qsAndAs.answerIds[0]]!;
        expect(answer1).toMatchObject({
            contents: [{ type: "text", text: "RZE" }],
        });

        const answer2 = qsAndAs.answers[qsAndAs.answerIds[1]]!;
        expect(answer2).toMatchObject({
            contents: [{ type: "text", text: "RZZ" }],
        });

        const answer3 = qsAndAs.answers[qsAndAs.answerIds[2]]!;
        expect(answer3).toMatchObject({
            contents: [{ type: "text", text: "RDE" }],
        });

        const answer4 = qsAndAs.answers[qsAndAs.answerIds[3]]!;
        expect(answer4).toMatchObject({
            contents: [{ type: "text", text: "RKR" }],
        });

        const answer5 = qsAndAs.answers[qsAndAs.answerIds[4]]!;
        expect(answer5).toMatchObject({
            contents: [{ type: "text", text: "YKR" }],
        });

        const answer6 = qsAndAs.answers[qsAndAs.answerIds[5]]!;
        expect(answer6).toMatchObject({
            contents: [{ type: "text", text: "RK" }],
        });
    });

    it("correctly sorts questions", () => {
        const options: GeneratorOptions = {
            units,
            properties,
            questions: { tag: "name", sort: true },
            answers:  { tag: "plate" },
        };

        const qsAndAs = generateMultipleAnswerQuestions(options);
        expect(qsAndAs.questionIds.length).toBe(4);    // 4 questions should be generated

        const question1 = qsAndAs.questions[qsAndAs.questionIds[0]]!;
        expect(question1).toMatchObject({
            contents: [{ type: "text", text: "miasto Krosno" }],
        });

        const question2 = qsAndAs.questions[qsAndAs.questionIds[1]]!;
        expect(question2).toMatchObject({
            contents: [{ type: "text", text: "powiat dębicki" }],
        });

        const question3 = qsAndAs.questions[qsAndAs.questionIds[2]]!;
        expect(question3).toMatchObject({
            contents: [{ type: "text", text: "powiat krośnieński" }],
        });

        const question4 = qsAndAs.questions[qsAndAs.questionIds[3]]!;
        expect(question4).toMatchObject({
            contents: [{ type: "text", text: "powiat rzeszowski" }],
        });
    });

    it("throws when sorting questions with no text content", () => {
        const options: GeneratorOptions = {
            units,
            properties,
            questions: { tag: "flag", sort: true },
            answers:  { tag: "plate" },
        };

        expect(() => generateMultipleAnswerQuestions(options)).toThrow("The provided questions must contain text.");
    });
});

describe("generateQuestionsAndItsAnswers", () => {
    it("correctly generates questions with single text content", () => {
        const options: GeneratorOptions = {
            units,
            properties,
            questions: { tag: "name" },
            answers: { tag: "plate" },
        };

        const qsAndAs1 = generateQuestionAndItsAnswers(unit1, options);

        const question1 = qsAndAs1.questions[qsAndAs1.questionIds[0]]!;
        expect(question1).toMatchObject({
            contents: [
                { type: "text", text: "powiat rzeszowski" },
            ],
            points: INITIAL_POINT_AMOUNT,
            tries: 0,
            numberGuessed: 0,
            numberCorrect: 2,
            guessed: false,
        });
        expect(question1.answerIds.length).toBe(2);

        const qsAndAs2 = generateQuestionAndItsAnswers(unit2, options);

        const question2 = qsAndAs2.questions[qsAndAs2.questionIds[0]]!;
        expect(question2).toMatchObject({
            contents: [
                { type: "text", text: "powiat dębicki" },
            ],
            points: INITIAL_POINT_AMOUNT,
            tries: 0,
            numberGuessed: 0,
            numberCorrect: 1,
            guessed: false,
        });
        expect(question2.answerIds.length).toBe(1);
    });

    it("correctly generates questions with multiple text contents", () => {
        const options: GeneratorOptions = {
            units,
            properties,
            questions: { tag: "plate" },
            answers: { tag: "name" },
        };

        const qsAndAs1 = generateQuestionAndItsAnswers(unit1, options);

        const question1 = qsAndAs1.questions[qsAndAs1.questionIds[0]]!;
        expect(question1).toMatchObject({
            contents: [
                { type: "text", text: "RZE" },
                { type: "text", text: "RZZ" },
            ],
            points: INITIAL_POINT_AMOUNT,
            tries: 0,
            numberGuessed: 0,
            numberCorrect: 1,
            guessed: false,
        });
        expect(question1.answerIds.length).toBe(1);

        const qsAndAs2 = generateQuestionAndItsAnswers(unit2, options);

        const question2 = qsAndAs2.questions[qsAndAs2.questionIds[0]]!;
        expect(question2).toMatchObject({
            contents: [
                { type: "text", text: "RDE" },
            ],
            points: INITIAL_POINT_AMOUNT,
            tries: 0,
            numberGuessed: 0,
            numberCorrect: 1,
            guessed: false,
        });
        expect(question2.answerIds.length).toBe(1);
    });

    it("uses the replacer when generating question content", () => {
        const options1: GeneratorOptions = {
            units,
            properties,
            questions: {
                tag: "plate",
                replacer: (props: Property[]) =>        // adds a prefix to every text property
                    props.map((prop) => (prop.type === "text")
                        ? { ...prop, text: "test" + prop.text }
                        : prop
                    ),
            },
            answers: { tag: "name" },
        };

        const qsAndAs1 = generateQuestionAndItsAnswers(unit1, options1);
        const question1 = qsAndAs1.questions[qsAndAs1.questionIds[0]]!;
        expect(question1).toMatchObject({
            contents: [
                { type: "text", text: "testRZE" },
                { type: "text", text: "testRZZ" },
            ],
        });

        const qsAndAs2 = generateQuestionAndItsAnswers(unit2, options1);
        const question2 = qsAndAs2.questions[qsAndAs2.questionIds[0]]!;
        expect(question2).toMatchObject({
            contents: [
                { type: "text", text: "testRDE" },
            ],
        });
    });
});

describe("generateCorrectAnswers", () => {
    it("correctly generates single text answers", () => {
        const options: GeneratorOptions = {
            units,
            properties,
            questions: { tag: "plate" },
            answers: { tag: "name" },
        };

        const answers1 = generateCorrectAnswers(unit1, "test1", options);
        expect(answers1.answerIds.length).toBe(1);

        const answer1 = answers1.answers[answers1.answerIds[0]];
        expect(answer1).toMatchObject({
            questionId: "test1",
            contents: [
                { type: "text", text: "powiat rzeszowski" }
            ],
            correct: true,
            guessed: false,
        });

        const answers2 = generateCorrectAnswers(unit2, "test2", options);
        expect(answers2.answerIds.length).toBe(1);

        const answer2 = answers2.answers[answers2.answerIds[0]];
        expect(answer2).toMatchObject({
            questionId: "test2",
            contents: [
                { type: "text", text: "powiat dębicki" }
            ],
            correct: true,
            guessed: false,
        });
    });

    it("correctly generates multiple text answers", () => {
        const options: GeneratorOptions = {
            units,
            properties,
            questions: { tag: "name" },
            answers: { tag: "plate" },
        };

        const answers = generateCorrectAnswers(unit1, "test1", options);
        expect(answers.answerIds.length).toBe(2);

        const answer1 = answers.answers[answers.answerIds[0]];
        expect(answer1).toMatchObject({
            questionId: "test1",
            contents: [
                { type: "text", text: "RZE" }
            ],
            correct: true,
            guessed: false,
        });

        const answer2 = answers.answers[answers.answerIds[1]];
        expect(answer2).toMatchObject({
            questionId: "test1",
            contents: [
                { type: "text", text: "RZZ" }
            ],
            correct: true,
            guessed: false,
        });
    });
});

describe("getUnitProperties", () => {
    it("returns the correct properties", () => {
        expect(getUnitProperties(unit1, properties)).toEqual([name1, capital1, plate1a, plate1b, flag1]);
        expect(getUnitProperties(unit2, properties)).toEqual([name2, capital2, plate2, flag2]);
    });
});
