import type { Guessable } from "src/data";

export const validCombos: Partial<Record<Guessable, Guessable[]>> = {
    name: ["capital", "plate"],
    capital: ["name", "plate"],
    plate: ["name", "capital"],
    flag: ["name", "capital", "plate"],
    coa: ["name", "capital", "plate"],
    map: ["name", "capital", "plate"],
};
