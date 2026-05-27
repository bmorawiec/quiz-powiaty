import { describe, expect, it } from "vitest";
import { rankAndPickBest } from "./rank";

describe("rankAndPickBest", () => {
    it("throws when the input array is empty", () => {
        expect(() => rankAndPickBest([], 0, () => 0)).toThrow("Cannot pick the best item from an empty array.");
    });

    it("correctly picks the best items", () => {
        const ranking: Record<string, number> = {
            "foo": 48,
            "foofoo": 123,
            "bar": 6389,
            "foobar": 234,
            "fooqux": 3289,
            "foobarqux": 44,
            "barbaz": 22,
            "foobarbaz": 478,
            "barqux": 888,
            "barbar": 5899,
            "quxbaz": 1337,
            "qux": 2137,
        };
        const input = Object.keys(ranking);
        const rank = (str: string) => ranking[str];

        expect(rankAndPickBest(input, 4, rank)).toEqual(["bar", "barbar", "fooqux", "qux"]);
        expect(rankAndPickBest(input, 6, rank)).toEqual(["bar", "barbar", "fooqux", "qux", "quxbaz", "barqux"]);
    });
});
