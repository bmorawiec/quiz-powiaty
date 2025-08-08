import type { Guessable } from "src/data";

export const validCombos: Partial<Record<Guessable, Guessable[]>> = {
    name: ["capital", "allCapitals", "plate", "allPlates"],
    allCapitals: ["name", "plate", "allPlates"],
    allPlates: ["name", "capital", "allCapitals"],
    flag: ["name", "capital", "allCapitals", "plate", "allPlates"],
    coa: ["name", "capital", "allCapitals", "plate", "allPlates"],
    map: ["name", "capital", "allCapitals", "plate", "allPlates"],
};
