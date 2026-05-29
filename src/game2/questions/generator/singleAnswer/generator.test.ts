import { PropertyNotFoundError, type ImageProperty, type Property, type TextProperty, type Unit } from "src/data";
import { describe, expect, it } from "vitest";
import { AnswerNotFoundError } from "../../answers";
import type { Content } from "../../content";
import { QuestionNotFoundError } from "../../questions";
import {
    generateCorrectAnswer,
    generateIncorrectAnswerCandidate,
    generateSingleAnswerQuestions,
    type GeneratorOptions,
} from "./generator";

const units: Unit[] = [
    { id: "aa", tags: ["landCounty"], propertyIds: ["name-aa", "capital-aa", "plate-aa", "flag-aa", "coa-aa", "shape-aa"]},
    { id: "ab", tags: ["landCounty"], propertyIds: ["name-ab", "capital-ab", "plate-ab", "flag-ab", "coa-ab", "shape-ab"]},
    { id: "ac", tags: ["landCounty"], propertyIds: ["name-ac", "capital-ac", "plate-ac", "flag-ac", "coa-ac", "shape-ac"]},
    { id: "ad", tags: ["landCounty"], propertyIds: ["name-ad", "capital-ad", "plate-ad", "flag-ad", "coa-ad", "shape-ad"]},
    { id: "ba", tags: ["landCounty"], propertyIds: ["name-ba", "capital-ba", "plate-ba", "flag-ba", "coa-ba", "shape-ba"]},
    { id: "bb", tags: ["landCounty"], propertyIds: ["name-bb", "capital-bb", "plate-bb", "flag-bb", "coa-bb", "shape-bb"]},
    { id: "bc", tags: ["landCounty"], propertyIds: ["name-bc", "capital-bc", "plate-bc", "flag-bc", "coa-bc", "shape-bc"]},
    { id: "bd", tags: ["landCounty"], propertyIds: ["name-bd", "capital-bd", "plate-bd", "flag-bd", "coa-bd", "shape-bd"]},
];

const properties: Record<string, Property> = {
    "name-aa": { type: "text", tag: "name", text: "powiat dębicki" },
    "name-ab": { type: "text", tag: "name", text: "powiat leżajski" },
    "name-ac": { type: "text", tag: "name", text: "powiat mielecki" },
    "name-ad": { type: "text", tag: "name", text: "powiat bieszczadzki" },
    "name-ba": { type: "text", tag: "name", text: "miasto Rzeszów" },
    "name-bb": { type: "text", tag: "name", text: "miasto Tarnobrzeg" },
    "name-bc": { type: "text", tag: "name", text: "miasto Krosno" },
    "name-bd": { type: "text", tag: "name", text: "miasto Przemyśl" },
    "capital-aa": { type: "text", tag: "capital", text: "Dębica" },
    "capital-ab": { type: "text", tag: "capital", text: "Leżajsk" },
    "capital-ac": { type: "text", tag: "capital", text: "Mielec" },
    "capital-ad": { type: "text", tag: "capital", text: "Ustrzyki Dolne" },
    "capital-ba": { type: "text", tag: "capital", text: "Rzeszów" },
    "capital-bb": { type: "text", tag: "capital", text: "Tarnobrzeg" },
    "capital-bc": { type: "text", tag: "capital", text: "Krosno" },
    "capital-bd": { type: "text", tag: "capital", text: "Przemyśl" },
    "plate-aa": { type: "text", tag: "plate", text: "RDE" },
    "plate-ab": { type: "text", tag: "plate", text: "RLE" },
    "plate-ac": { type: "text", tag: "plate", text: "RMI" },
    "plate-ad": { type: "text", tag: "plate", text: "RBI" },
    "plate-ba": { type: "text", tag: "plate", text: "RZ" },
    "plate-bb": { type: "text", tag: "plate", text: "RT" },
    "plate-bc": { type: "text", tag: "plate", text: "RK" },
    "plate-bd": { type: "text", tag: "plate", text: "RP" },
    "flag-aa": { type: "image", tag: "flag", url: "/dummy-path/aa.svg" },
    "flag-ab": { type: "image", tag: "flag", url: "/dummy-path/ab.svg" },
    "flag-ac": { type: "image", tag: "flag", url: "/dummy-path/ac.svg" },
    "flag-ad": { type: "image", tag: "flag", url: "/dummy-path/ad.svg" },
    "flag-ba": { type: "image", tag: "flag", url: "/dummy-path/ba.svg" },
    "flag-bb": { type: "image", tag: "flag", url: "/dummy-path/bb.svg" },
    "flag-bc": { type: "image", tag: "flag", url: "/dummy-path/bc.svg" },
    "flag-bd": { type: "image", tag: "flag", url: "/dummy-path/bd.svg" },
};

const nameToPlateOptions: GeneratorOptions = {
    questions: {
        units,
        properties,
        tags: ["name"],
        contentGenerator: (properties: Property[]) => ({
            type: "text",
            text: properties.map((property) => (property as TextProperty).text).join(", "),
        }),
    },
    answers: {
        units,
        properties,
        tags: ["plate"],
        contentGenerator: (properties: Property[]) => ({
            type: "text",
            text: properties.map((property) => (property as TextProperty).text).join(", "),
        }),
        howManyIncorrect: 5,
        rankIncorrect: (_questionProperties: Property[], answerProperties: Property[]) => {
            const plateProperty = answerProperties
                .find((property) => property.tag === "plate") as TextProperty | undefined;
            if (!plateProperty) {
                throw new PropertyNotFoundError();
            }

            return {
                "RBI": 100,
                "RMI": 90,
                "RT": 80,
                "RP": 70,
                "RDE": 60,
                "RZ": 50,
                "RK": 40,
                "RLE": 30,
            }[plateProperty.text]!;
        },
    },
};

const plateToNameAndFlagOptions: GeneratorOptions = {
    questions: {
        units,
        properties,
        tags: ["plate"],
        contentGenerator: (properties: Property[]) => ({
            type: "text",
            text: properties.map((property) => (property as TextProperty).text).join(", "),
        }),
    },
    answers: {
        units,
        properties,
        tags: ["name", "flag"],
        contentGenerator: (properties: Property[]) => {
            const flagProperty = properties.find((property) => property.tag === "flag") as ImageProperty | undefined;
            if (!flagProperty) {
                throw new PropertyNotFoundError();
            }
            return {
                type: "textAndImage",
                url: flagProperty.url,
                text: (properties.filter((property) => property.tag === "name") as TextProperty[])
                    .map((property) => property.text)
                    .join(", "),
            };
        },
        howManyIncorrect: 3,
        rankIncorrect: (_questionProperties: Property[], answerProperties: Property[]) => {
            const nameProperty = answerProperties
                .find((property) => property.tag === "name") as TextProperty | undefined;
            if (!nameProperty) {
                throw new PropertyNotFoundError();
            }

            return {
                "powiat dębicki": 100,
                "miasto Tarnobrzeg": 90,
                "miasto Krosno": 80,
                "powiat mielecki": 70,
                "powiat bieszczadzki": 60,
                "miasto Rzeszów": 50,
                "miasto Przemyśl": 40,
                "powiat leżajski": 30,
            }[nameProperty.text]!;
        },
    },
};

describe("generateSingleAnswerQuestions", () => {
    it("generates the correct amount of correct and incorrect answers", () => {
        const qsAndAs1 = generateSingleAnswerQuestions(nameToPlateOptions);
        for (const questionId of qsAndAs1.questionIds) {
            const question = qsAndAs1.questions[questionId];
            if (!question) throw new QuestionNotFoundError(questionId);

            const answers = question.answerIds.map((id) => {
                const answer = qsAndAs1.answers[id];
                if (!answer) throw new AnswerNotFoundError(id);
                return answer;
            });

            expect(answers.filter((ans) => ans.correct).length).toBe(1);
            expect(answers.filter((ans) => !ans.correct).length).toBe(5);
        }

        const qsAndAs2 = generateSingleAnswerQuestions(plateToNameAndFlagOptions);
        for (const questionId of qsAndAs2.questionIds) {
            const question = qsAndAs2.questions[questionId];
            if (!question) throw new QuestionNotFoundError(questionId);

            const answers = question.answerIds.map((id) => {
                const answer = qsAndAs2.answers[id];
                if (!answer) throw new AnswerNotFoundError(id);
                return answer;
            });

            expect(answers.filter((ans) => ans.correct).length).toBe(1);
            expect(answers.filter((ans) => !ans.correct).length).toBe(3);
        }
    });

    it("picks the best incorrect answers depending on the ranking function", () => {
        const qsAndAs1 = generateSingleAnswerQuestions(nameToPlateOptions);
        for (const questionId of qsAndAs1.questionIds) {
            const question = qsAndAs1.questions[questionId];
            if (!question) throw new QuestionNotFoundError(questionId);

            const answerContents = question.answerIds.map((id) => {
                const answer = qsAndAs1.answers[id];
                if (!answer) throw new AnswerNotFoundError(id);
                return answer.content;
            });

            expect(answerContents).toContainEqual({ type: "text", text: "RBI" });
            expect(answerContents).toContainEqual({ type: "text", text: "RMI" });
            expect(answerContents).toContainEqual({ type: "text", text: "RT" });
            expect(answerContents).toContainEqual({ type: "text", text: "RP" });
            expect(answerContents).toContainEqual({ type: "text", text: "RDE" });
        }

        const qsAndAs2 = generateSingleAnswerQuestions(plateToNameAndFlagOptions);
        for (const questionId of qsAndAs2.questionIds) {
            const question = qsAndAs2.questions[questionId];
            if (!question) throw new QuestionNotFoundError(questionId);

            const answerContents = question.answerIds.map((id) => {
                const answer = qsAndAs2.answers[id];
                if (!answer) throw new AnswerNotFoundError(id);
                return answer.content;
            });

            expect(answerContents).toContainEqual({
                type: "textAndImage",
                text: "powiat dębicki",
                url: "/dummy-path/aa.svg",
            });
            expect(answerContents).toContainEqual({
                type: "textAndImage",
                text: "miasto Tarnobrzeg",
                url: "/dummy-path/bb.svg",
            });
            expect(answerContents).toContainEqual({
                type: "textAndImage",
                text: "miasto Krosno",
                url: "/dummy-path/bc.svg",
            });
        }
    });
});

describe("generateIncorrectAnswerCandidate", () => {
    it("correctly picks properties of the provided unit", () => {
        for (const unit of units) {
            const candidate = generateIncorrectAnswerCandidate(unit, nameToPlateOptions);
            expect(candidate.properties).toEqual([
                properties["plate-" + unit.id],
            ]);
        }
    });
});

describe("generateCorrectAnswer", () => {
    it("passes the correct tags to the content generator", () => {
        const createOptions = (contentGenerator: (properties: Property[]) => Content) => ({
            questions: {},
            answers: {
                units,
                properties,
                tags: ["plate", "name"],
                contentGenerator,
                howManyIncorrect: 5,
            },
        } as GeneratorOptions);

        const options1 = createOptions((properties) => {
            expect(properties).toEqual([
                { type: "text", tag: "name", text: "powiat dębicki" } satisfies TextProperty,
                { type: "text", tag: "plate", text: "RDE" } satisfies TextProperty,
            ]);
            return {
                type: "text",
                text: "<placeholder>",
            };
        });
        generateCorrectAnswer(units[0], "", options1);
    });

    it("sets fields to the correct values", () => {
        const testQuestionId = "test-question-id";
        for (const unit of units) {
            const answer = generateCorrectAnswer(unit, testQuestionId, nameToPlateOptions);
            expect(answer.questionId).toBe(testQuestionId);
            expect(answer.content).toStrictEqual({
                type: "text",
                text: (properties["plate-" + unit.id] as TextProperty).text
            });
            expect(answer.correct).toBe(true);
            expect(answer.guessed).toBe(false);
        }
    });
});
