import { describe, expect, it } from "vitest";
import type { Property, Unit } from "./types";
import { getUnitProperties } from "./utils";

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
};

describe("getUnitProperties", () => {
    it("returns the correct properties", () => {
        expect(getUnitProperties(unit1, properties)).toEqual([name1, capital1, plate1a, plate1b, flag1]);
        expect(getUnitProperties(unit2, properties)).toEqual([name2, capital2, plate2, flag2]);
    });
});
