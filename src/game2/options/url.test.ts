import { describe, expect, it } from "vitest";
import { optionsFromURL, optionsToURL } from "./url/options";

describe("optionsToURL", () => {
    it("correctly encodes game options", () => {
        expect(optionsToURL({
            mode: "choice",
            unitType: "county",
            guessFrom: "name",
            guess: "shape",
            maxQuestions: Infinity,
            filters: {
                countyTypes: ["cityCounty"],
                voivodeships: ["02", "28", "18"],
            }
        })).toBe("#365894ce99022818cc");

        expect(optionsToURL({
            mode: "dnd",
            unitType: "county",
            guessFrom: "capital",
            guess: "coa",
            maxQuestions: 50,
            filters: {
                countyTypes: [],
                voivodeships: ["04", "06", "10", "12", "14", "32"],
            }
        })).toBe("#363235dd50040610121432");

        expect(optionsToURL({
            mode: "prompt",
            unitType: "voivodeship",
            guessFrom: "plate",
            guess: "flag",
            maxQuestions: 5,
            filters: {
                countyTypes: [],
                voivodeships: [],
            }
        })).toBe("#869534pt05");
    });

    it("encodes unknown maxQuestions values for infinity", () => {
        expect(optionsToURL({
            mode: "prompt",
            unitType: "voivodeship",
            guessFrom: "plate",
            guess: "flag",
            maxQuestions: 123,
            filters: {
                countyTypes: [],
                voivodeships: [],
            }
        })).toBe("#869534pt99");
    });
});

describe("optionsFromURL", () => {
    it("correctly decodes game options", () => {
        expect(optionsFromURL("#365894ce99022818cc")).toEqual({
            mode: "choice",
            unitType: "county",
            guessFrom: "name",
            guess: "shape",
            maxQuestions: Infinity,
            filters: {
                countyTypes: ["cityCounty"],
                voivodeships: ["02", "28", "18"],
            }
        });

        expect(optionsFromURL("#363235dd50040610121432")).toEqual({
            mode: "dnd",
            unitType: "county",
            guessFrom: "capital",
            guess: "coa",
            maxQuestions: 50,
            filters: {
                countyTypes: [],
                voivodeships: ["04", "06", "10", "12", "14", "32"],
            }
        });

        expect(optionsFromURL("#869534pt05")).toEqual({
            mode: "prompt",
            unitType: "voivodeship",
            guessFrom: "plate",
            guess: "flag",
            maxQuestions: 5,
            filters: {
                countyTypes: [],
                voivodeships: [],
            }
        });
    });
});
