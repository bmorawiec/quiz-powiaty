import type { CountyType, VoivodeshipId } from "src/data/common";
import { type UnitFilters } from "./types";
import { areFiltersEmpty } from "./utils";

export const filterNames = {
    countyTypes: {
        county: "powiat",
        city: "miasto na prawach powiatu",
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
    } satisfies Record<VoivodeshipId, string>,
};

export function getFilterString(filters: UnitFilters): string {
    if (areFiltersEmpty(filters)) {
        return "Nie ustawiono";
    }
    return [
        ...filters.countyTypes.map((countyType) => filterNames.countyTypes[countyType]),
        ...filters.voivodeships.map((voivId) => filterNames.voivodeships[voivId]),
    ].join(", ");
}
