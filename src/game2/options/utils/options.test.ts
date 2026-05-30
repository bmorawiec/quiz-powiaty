import { describe, expect, it } from "vitest";
import { validateGameOptions } from "./options";
import { guessables } from "../types";

describe("validateGameOptions", () => {
    it("properly flags valid combos", () => {
        expect(validateGameOptions({
            mode: "choiceGame",
            unitType: "voivodeship",
            guessFrom: "capital",
            guess: "name",
            maxQuestions: 20,
            filters: { countyTypes: [], voivodeships: [], },
        })).toBe(true);

        expect(validateGameOptions({
            mode: "dndGame",
            unitType: "county",
            guessFrom: "name",
            guess: "flag",
            maxQuestions: 15,
            filters: { countyTypes: [], voivodeships: [], },
        })).toBe(true);
    });

    it("detects invalid guessFrom-guess combos", () => {
        for (const guessable of guessables) {
            expect(validateGameOptions({
                mode: "choiceGame",
                unitType: "county",
                guessFrom: guessable,
                guess: guessable,
                maxQuestions: 30,
                filters: { countyTypes: [], voivodeships: [], },
            })).toBe(false);
        }
    });

    it("detects which guessFrom-guess combos are voivodeship-only", () => {
        expect(validateGameOptions({
            mode: "choiceGame",
            unitType: "county",
            guessFrom: "name",
            guess: "capital",
            maxQuestions: 30,
            filters: { countyTypes: [], voivodeships: [], },
        })).toBe(false);

        expect(validateGameOptions({
            mode: "choiceGame",
            unitType: "county",
            guessFrom: "capital",
            guess: "name",
            maxQuestions: 30,
            filters: { countyTypes: [], voivodeships: [], },
        })).toBe(false);
    });

    it("detects which combos of the mode, guessFrom and guess fields are invalid", () => {
        expect(validateGameOptions({
            mode: "promptGame",
            unitType: "voivodeship",
            guessFrom: "capital",
            guess: "flag",
            maxQuestions: 30,
            filters: { countyTypes: [], voivodeships: [], },
        })).toBe(false);

        expect(validateGameOptions({
            mode: "typingGame",
            unitType: "voivodeship",
            guessFrom: "capital",
            guess: "coa",
            maxQuestions: 10,
            filters: { countyTypes: [], voivodeships: [], },
        })).toBe(false);

        expect(validateGameOptions({
            mode: "promptGame",
            unitType: "county",
            guessFrom: "capital",
            guess: "shape",
            maxQuestions: 25,
            filters: { countyTypes: [], voivodeships: [], },
        })).toBe(false);
    });
});
