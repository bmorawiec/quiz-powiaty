import type { Property, PropertyTag } from "src/data";
import type { GameOptions } from "src/game2/options";
import type { Content, ContentGenerator } from "src/game2/questions";
import { describe, expect, it } from "vitest";
import { richAnswers } from "./richAnswers";

const EXAMPLE_SHAPE: number[][] = [[0, 0, 10, 10, 10, 0], [100, 100, 110, 100, 110, 110]];

const IRRELEVANT_OPTIONS = {
    mode: "choiceGame",
    maxQuestions: 20,
    filters: {
        countyTypes: [],
        voivodeships: [],
    },
} satisfies Partial<GameOptions>;

const voivodeshipProperties: Property[] = [
    { type: "text", tag: "name", text: "województwo kujawsko-pomorskie" },
    { type: "text", tag: "unambiguousName", text: "województwo kujawsko-pomorskie" },
    { type: "text", tag: "shortName", text: "kujawsko-pomorskie" },
    { type: "text", tag: "capital", text: "Bydgoszcz" },
    { type: "text", tag: "capital", text: "Toruń" },
    { type: "text", tag: "plate", text: "C" },
    { type: "image", tag: "flag", url: "/dummy-path/flag/kujawsko-pomorskie.svg" },
    { type: "image", tag: "coa", url: "/dummy-path/coa/kujawsko-pomorskie.svg" },
    { type: "shape", tag: "shape", shape: EXAMPLE_SHAPE },
];

const countyProperties: Property[] = [
    { type: "text", tag: "name", text: "powiat krośnieński" },
    { type: "text", tag: "unambiguousName", text: "powiat krośnieński (Krosno)" },
    { type: "text", tag: "shortName", text: "krośnieński" },
    { type: "text", tag: "capital", text: "Krosno" },
    { type: "text", tag: "plate", text: "RKR" },
    { type: "text", tag: "plate", text: "YKR" },
    { type: "image", tag: "flag", url: "/dummy-path/flag/krośnieński.svg" },
    { type: "image", tag: "coa", url: "/dummy-path/coa/krośnieński.svg" },
    { type: "shape", tag: "shape", shape: EXAMPLE_SHAPE },
];

interface TestEntry {
    generator: [ContentGenerator, PropertyTag[]];
    expectedContent: Content;
}

const questionTests = {
    counties: [
        {
            generator: richAnswers({
                ...IRRELEVANT_OPTIONS,
                unitType: "county",
                guessFrom: "plate",
                guess: "name",
            }),
            expectedContent: {
                type: "titledImage",
                url: "/dummy-path/coa/krośnieński.svg",
                text: "powiat krośnieński (Krosno)",
            },
        },
        {
            generator: richAnswers({
                ...IRRELEVANT_OPTIONS,
                unitType: "county",
                guessFrom: "coa",
                guess: "name",
            }),
            expectedContent: {
                type: "text",
                text: "powiat krośnieński (Krosno)",
            },
        },
        {
            generator: richAnswers({
                ...IRRELEVANT_OPTIONS,
                unitType: "county",
                guessFrom: "flag",
                guess: "name",
            }),
            expectedContent: {
                type: "text",
                text: "powiat krośnieński (Krosno)",
            },
        },
        {
            generator: richAnswers({
                ...IRRELEVANT_OPTIONS,
                unitType: "county",
                guessFrom: "coa",
                guess: "plate",
            }),
            expectedContent: {
                type: "multiplePlates",
                codes: ["RKR", "YKR"],
            },
        },
        {
            generator: richAnswers({
                ...IRRELEVANT_OPTIONS,
                unitType: "county",
                guessFrom: "name",
                guess: "flag",
            }),
            expectedContent: {
                type: "image",
                url: "/dummy-path/flag/krośnieński.svg",
            },
        },
        {
            generator: richAnswers({
                ...IRRELEVANT_OPTIONS,
                unitType: "county",
                guessFrom: "name",
                guess: "coa",
            }),
            expectedContent: {
                type: "tallImage",
                url: "/dummy-path/coa/krośnieński.svg",
            },
        },
        {
            generator: richAnswers({
                ...IRRELEVANT_OPTIONS,
                unitType: "county",
                guessFrom: "name",
                guess: "shape",
            }),
            expectedContent: {
                type: "shape",
                shape: EXAMPLE_SHAPE,
            },
        },
    ] satisfies TestEntry[],
    voivodeships: [
        {
            generator: richAnswers({
                ...IRRELEVANT_OPTIONS,
                unitType: "voivodeship",
                guessFrom: "name",
                guess: "capital",
            }),
            expectedContent: {
                type: "text",
                text: "Bydgoszcz, Toruń"
            },
        },
    ] satisfies TestEntry[],
};

describe("richAnswers", () => {
    it("generates correct question content for example game options", () => {
        for (const test of questionTests.counties) {
            const [generator, tags] = test.generator;
            expect(generator(countyProperties.filter((property) => tags.includes(property.tag))))
                .toEqual(test.expectedContent);
        }

        for (const test of questionTests.voivodeships) {
            const [generator, tags] = test.generator;
            expect(generator(voivodeshipProperties.filter((property) => tags.includes(property.tag))))
                .toEqual(test.expectedContent);
        }
    });
});
