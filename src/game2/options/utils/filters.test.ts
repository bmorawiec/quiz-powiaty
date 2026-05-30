import { describe, expect, it } from "vitest";
import { getFilterString } from "./filters";

describe("getFilterString", () => {
    it("returns correct values", () => {
        expect(getFilterString({
            countyTypes: ["cityCounty"],
            voivodeships: ["02", "06", "10", "28", "32"],
        })).toBe("miasto na prawach powiatu, dolnośląskie, lubelskie, łódzkie, warmińsko-mazurskie, "
            + "zachodniopomorskie");

        expect(getFilterString({
            countyTypes: [],
            voivodeships: ["18", "26", "16", "12"],
        })).toBe("podkarpackie, świętokrzyskie, opolskie, małopolskie");

        expect(getFilterString({
            countyTypes: [],
            voivodeships: [],
        })).toBe("Nie ustawiono");

        expect(getFilterString({
            countyTypes: ["landCounty"],
            voivodeships: [],
        })).toBe("powiat");
    });
});
