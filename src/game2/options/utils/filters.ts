import type { VoivodeshipCode } from "src/data";
import type { CountyType, GameFilters } from "../types";

export const filterNames = {
    countyTypes: {
        landCounty: "powiat",
        cityCounty: "miasto na prawach powiatu",
    } satisfies Record<CountyType, string>,

    voivodeships: {
        "02": "dolnośląskie",
        "04": "kujawsko-pomorskie",
        "06": "lubelskie",
        "08": "lubuskie",
        "10": "łódzkie",
        "12": "małopolskie",
        "14": "mazowieckie",
        "16": "opolskie",
        "18": "podkarpackie",
        "20": "podlaskie",
        "22": "pomorskie",
        "24": "śląskie",
        "26": "świętokrzyskie",
        "28": "warmińsko-mazurskie",
        "30": "wielkopolskie",
        "32": "zachodniopomorskie",
    } satisfies Record<VoivodeshipCode, string>,
};

/** Returns a string describing the applied filters. */
export function getFilterString(filters: GameFilters) {
    if (areFiltersEmpty(filters)) {
        return "Nie ustawiono";
    }
    return [
        ...filters.countyTypes.map((countyType) => filterNames.countyTypes[countyType]),
        ...filters.voivodeships.map((voivId) => filterNames.voivodeships[voivId]),
    ].join(", ");
}

export function areFiltersEmpty(filters: GameFilters): boolean {
    return filters.countyTypes.length === 0 && filters.voivodeships.length === 0;
}
