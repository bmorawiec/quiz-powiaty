import type { UnitFilters } from "src/gameOptions";
import type { CountyType, GameFilters } from "../types/filters";
import { voivodeshipCodes, type VoivodeshipCode } from "src/data";
import { flipObject } from "src/utils/flipObject";

const countyTypeToCode: Record<CountyType, string> = {
    cityCounty: "cc",
    landCounty: "lc",
};

const codeToCountyType = flipObject(countyTypeToCode);

export function encodeFilters(filters: GameFilters): string {
    let encodedFilters = "";
    for (const voivodeshipCode of filters.voivodeships) {
        encodedFilters += voivodeshipCode;
    }
    for (const countyType of filters.countyTypes) {
        encodedFilters += countyTypeToCode[countyType];
    }
    return encodedFilters;
}

export function decodeFilters(encodedFilters: string): UnitFilters | null {
    if (encodedFilters.length % 2 != 0) {
        return null;
    }

    const filters: UnitFilters = {
        countyTypes: [],
        voivodeships: [],
    };

    for (let index = 0; index < encodedFilters.length; index += 2) {
        const code = encodedFilters.slice(index, index + 2);
        if (voivodeshipCodes.includes(code as VoivodeshipCode)) {
            filters.voivodeships.push(code);
        } else {
            const countyType = codeToCountyType[code];
            if (!countyType) {
                return null;
            }
            filters.countyTypes.push(countyType);
        }
    }

    return filters;
}
