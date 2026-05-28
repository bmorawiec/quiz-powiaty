import type { ImageProperty, Property, TextProperty, Unit } from "src/data";
import type { TextContent } from "../../content";
import { getUnitProperties, PropertyNotFoundError, UnexpectedPropertyTypeError } from "src/data";
import { describe, expect, it } from "vitest";
import { INITIAL_POINT_AMOUNT } from "../../questions";
import {
    generateCorrectAnswers,
    generateMultipleAnswerQuestions,
    generateQuestionAndItsAnswers,
    type GeneratorOptions
} from "./generator";
import type { Content } from "../../content";

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

const nameQuestionContentGenerator = (properties: Property[]): Content => {
    const property = properties.find((property) => property.tag === "name") as TextProperty;
    if (!property) {
        throw new PropertyNotFoundError();
    }
    return {
        type: "text",
        text: property.text,
    };
};

const nameAnswerContentGenerator = (property: Property): Content => {
    if (property.tag != "name") {
        throw new UnexpectedPropertyTypeError();
    }
    return {
        type: "text",
        text: property.text,
    };
};

const plateAnswerContentGenerator = (property: Property): Content => {
    if (property.tag != "plate") {
        throw new UnexpectedPropertyTypeError();
    }
    return {
        type: "plate",
        code: property.text,
    };
};

describe("generateMultipleAnswerQuestions", () => {
    it("generates the correct amount of questions and answers, in the right order", () => {
        const options: GeneratorOptions = {
            units,
            properties,
            questions: {
                tags: ["name"],
                contentGenerator: nameQuestionContentGenerator,
            },
            answers: {
                tag: "plate",
                contentGenerator: plateAnswerContentGenerator,
            },
        };

        const qsAndAs = generateMultipleAnswerQuestions(options);
        expect(qsAndAs.questionIds.length).toBe(4);    // expecting 4 questions to be generated

        // checking if the order of the questions is the same as in the input
        // no in-depth verification of the structure of the generated questions or answers
        const question1 = qsAndAs.questions[qsAndAs.questionIds[0]]!;
        expect(question1).toMatchObject({
            content: { type: "text", text: "powiat rzeszowski" },
        });

        const question2 = qsAndAs.questions[qsAndAs.questionIds[1]]!;
        expect(question2).toMatchObject({
            content: { type: "text", text: "powiat dębicki" },
        });

        const question3 = qsAndAs.questions[qsAndAs.questionIds[2]]!;
        expect(question3).toMatchObject({
            content: { type: "text", text: "powiat krośnieński" },
        });

        const question4 = qsAndAs.questions[qsAndAs.questionIds[3]]!;
        expect(question4).toMatchObject({
            content: { type: "text", text: "miasto Krosno" },
        });

        expect(qsAndAs.answerIds.length).toBe(6);   // expecting 6 answers to be generated

        // checking if the order of the questions is the same as in the input
        // no in-depth verification of the structure of the generated questions or answers
        const answer1 = qsAndAs.answers[qsAndAs.answerIds[0]]!;
        expect(answer1).toMatchObject({
            content: { type: "plate", code: "RZE" },
        });

        const answer2 = qsAndAs.answers[qsAndAs.answerIds[1]]!;
        expect(answer2).toMatchObject({
            content: { type: "plate", code: "RZZ" },
        });

        const answer3 = qsAndAs.answers[qsAndAs.answerIds[2]]!;
        expect(answer3).toMatchObject({
            content: { type: "plate", code: "RDE" },
        });

        const answer4 = qsAndAs.answers[qsAndAs.answerIds[3]]!;
        expect(answer4).toMatchObject({
            content: { type: "plate", code: "RKR" },
        });

        const answer5 = qsAndAs.answers[qsAndAs.answerIds[4]]!;
        expect(answer5).toMatchObject({
            content: { type: "plate", code: "YKR" },
        });

        const answer6 = qsAndAs.answers[qsAndAs.answerIds[5]]!;
        expect(answer6).toMatchObject({
            content: { type: "plate", code: "RK" },
        });
    });

    it("correctly sorts questions", () => {
        const options: GeneratorOptions = {
            units,
            properties,
            questions: {
                tags: ["name"],
                contentGenerator: nameQuestionContentGenerator,
                sorter: (a, b) => (a.content as TextContent).text.localeCompare((b.content as TextContent).text),
            },
            answers:  {
                tag: "plate",
                contentGenerator: plateAnswerContentGenerator,
            },
        };

        const qsAndAs = generateMultipleAnswerQuestions(options);
        expect(qsAndAs.questionIds.length).toBe(4);    // 4 questions should be generated

        const question1 = qsAndAs.questions[qsAndAs.questionIds[0]]!;
        expect(question1).toMatchObject({
            content: { type: "text", text: "miasto Krosno" },
        });

        const question2 = qsAndAs.questions[qsAndAs.questionIds[1]]!;
        expect(question2).toMatchObject({
            content: { type: "text", text: "powiat dębicki" },
        });

        const question3 = qsAndAs.questions[qsAndAs.questionIds[2]]!;
        expect(question3).toMatchObject({
            content: { type: "text", text: "powiat krośnieński" },
        });

        const question4 = qsAndAs.questions[qsAndAs.questionIds[3]]!;
        expect(question4).toMatchObject({
            content: { type: "text", text: "powiat rzeszowski" },
        });
    });
});

describe("generateQuestionsAndItsAnswers", () => {
    it("generates questions from a single property", () => {
        const options: GeneratorOptions = {
            units,
            properties,
            questions: {
                tags: ["name"],
                contentGenerator: nameQuestionContentGenerator,
            },
            answers: {
                tag: "plate",
                contentGenerator: plateAnswerContentGenerator,
            },
        };

        const qsAndAs1 = generateQuestionAndItsAnswers(unit1, options);

        const question1 = qsAndAs1.questions[qsAndAs1.questionIds[0]]!;
        expect(question1).toMatchObject({
            content: { type: "text", text: "powiat rzeszowski" },
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
            content: { type: "text", text: "powiat dębicki" },
            points: INITIAL_POINT_AMOUNT,
            tries: 0,
            numberGuessed: 0,
            numberCorrect: 1,
            guessed: false,
        });
        expect(question2.answerIds.length).toBe(1);
    });

    it("generates questions from multiple properties", () => {
        const options: GeneratorOptions = {
            units,
            properties,
            questions: {
                tags: ["plate", "flag"],
                contentGenerator: (properties: Property[]) => {
                    const imageProperty = properties.find((property) => property.tag === "flag") as ImageProperty;
                    if (!imageProperty) {
                        throw new PropertyNotFoundError();
                    }
                    return {
                        type: "textAndImage",
                        text: (properties.filter((property) => property.tag === "plate") as TextProperty[])
                            .map((property) => property.text)
                            .join(", "),
                        url: imageProperty.url,
                    };
                },
            },
            answers: {
                tag: "plate",
                contentGenerator: plateAnswerContentGenerator,
            },
        };

        const qsAndAs1 = generateQuestionAndItsAnswers(unit1, options);

        const question1 = qsAndAs1.questions[qsAndAs1.questionIds[0]]!;
        expect(question1).toMatchObject({
            content: { type: "textAndImage", text: "RZE, RZZ", url: "/dummy-path/1.svg" },
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
            content: { type: "textAndImage", text: "RDE", url: "/dummy-path/2.svg" },
            points: INITIAL_POINT_AMOUNT,
            tries: 0,
            numberGuessed: 0,
            numberCorrect: 1,
            guessed: false,
        });
        expect(question2.answerIds.length).toBe(1);
    });
});

describe("generateCorrectAnswers", () => {
    it("correctly generates a single answer", () => {
        const options: GeneratorOptions = {
            units,
            properties,
            questions: {
                tags: ["name"],
                contentGenerator: nameQuestionContentGenerator,
            },
            answers: {
                tag: "name",
                contentGenerator: nameAnswerContentGenerator,
            },
        };

        const answers1 = generateCorrectAnswers(unit1, "test1", options);
        expect(answers1.answerIds.length).toBe(1);

        const answer1 = answers1.answers[answers1.answerIds[0]];
        expect(answer1).toMatchObject({
            questionId: "test1",
            content: { type: "text", text: "powiat rzeszowski" },
            correct: true,
            guessed: false,
        });

        const answers2 = generateCorrectAnswers(unit2, "test2", options);
        expect(answers2.answerIds.length).toBe(1);

        const answer2 = answers2.answers[answers2.answerIds[0]];
        expect(answer2).toMatchObject({
            questionId: "test2",
            content: { type: "text", text: "powiat dębicki" },
            correct: true,
            guessed: false,
        });
    });

    it("correctly generates multiple answers", () => {
        const options: GeneratorOptions = {
            units,
            properties,
            questions: {
                tags: ["name"],
                contentGenerator: nameQuestionContentGenerator,
            },
            answers: {
                tag: "plate",
                contentGenerator: plateAnswerContentGenerator,
            },
        };

        const answers = generateCorrectAnswers(unit1, "test1", options);
        expect(answers.answerIds.length).toBe(2);

        const answer1 = answers.answers[answers.answerIds[0]];
        expect(answer1).toMatchObject({
            questionId: "test1",
            content: { type: "plate", code: "RZE" },
            correct: true,
            guessed: false,
        });

        const answer2 = answers.answers[answers.answerIds[1]];
        expect(answer2).toMatchObject({
            questionId: "test1",
            content: { type: "plate", code: "RZZ" },
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
