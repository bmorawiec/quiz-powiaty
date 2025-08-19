import type { ValidOptions } from "src/game/common";

export const validOptions: ValidOptions = {
    name: {
        capital: "voivodeship",
        plate: "*",
        flag: "*",
        coa: "*",
    },
    capital: {
        name: "voivodeship",
        plate: "*",
        flag: "*",
        coa: "*",
    },
    plate: {
        name: "*",
        capital: "*",
        flag: "*",
        coa: "*",
    },
    flag: {
        name: "*",
        capital: "*",
        plate: "*",
    },
    coa: {
        name: "*",
        capital: "*",
        plate: "*",
    },
    map: {
        name: "*",
        capital: "*",
        plate: "*",
        flag: "*",
        coa: "*",
    }
};
