import { voivodeshipIds, type CountyType, type Guessable, type UnitType, type VoivodeshipId } from "src/data/common";
import { type GameOptions, type GameType, type UnitFilters } from "./types";

const gameTypeToPolish: Record<GameType, string> = {
    choiceGame: "wybierz",
    dndGame: "przyporzadkuj",
    mapGame: "mapa",
    promptGame: "zgadnij",
    typingGame: "podpisz",
};

const unitTypeToPolish: Record<UnitType, string> = {
    county: "powiat",
    voivodeship: "wojewodztwo",
};

const guessableToPolish: Record<Guessable, string> = {
    name: "nazwa",
    capital: "stolica",
    plate: "rejestracja",
    flag: "flaga",
    coa: "herb",
    map: "mapa",
};

const countyTypeToPolish: Record<CountyType, string> = {
    county: "powiat",
    city: "miasto",
};

const gameTypeFromPolish = flipObject(gameTypeToPolish);
const unitTypeFromPolish = flipObject(unitTypeToPolish);
const guessableFromPolish = flipObject(guessableToPolish);
const countyTypeFromPolish = flipObject(countyTypeToPolish);

/** Encodes game options into an URL. */
export function encodeGameURL(options: GameOptions): string {
    let url = "/graj"
        + "?tryb=" + gameTypeToPolish[options.gameType]
        + "&typ=" + unitTypeToPolish[options.unitType]
        + "&dane=" + guessableToPolish[options.guessFrom]
        + "&zgadnij=" + guessableToPolish[options.guess];

    if (options.maxQuestions) {
        url += "&max=" + options.maxQuestions;
    }

    const encodedFilters = encodeFilters(options.filters);
    if (encodedFilters) {
        url += "&filtry=" + encodedFilters;
    }

    return url;
}

function encodeFilters(filters: UnitFilters): string | null {
    const groups: string[] = [];
    if (filters.countyTypes.length > 0) {
        groups.push("typ:" + filters.countyTypes
            .map((countyType) => countyTypeToPolish[countyType])
            .join(","));
    }
    if (filters.voivodeships.length > 0) {
        for (const id of filters.voivodeships) {
            if (!voivodeshipIds.includes(id)) {
                throw new Error("Cannot encode filters: Nonexistent voivodeship ID: " + id);
            }
        }
        groups.push("woj:" + filters.voivodeships.join(","));
    }

    if (groups.length === 0) {
        return null
    } else {
        return groups.join(";");
    }
}

/** Reads game options from URL search params (the part of the URL after the '?').
 *  @returns null if the URL is invalid. Otherwise returns a GameOptions object. */
export function decodeGameURL(params: URLSearchParams): GameOptions | null {
    const gameTypePl = params.get("tryb");
    const unitTypePl = params.get("typ");
    const guessFromPl = params.get("dane");
    const guessPl = params.get("zgadnij");
    if (!gameTypePl || !unitTypePl || !guessFromPl || !guessPl) {
        return null;
    }

    const gameType = gameTypeFromPolish[gameTypePl];
    const unitType = unitTypeFromPolish[unitTypePl];
    const guessFrom = guessableFromPolish[guessFromPl];
    const guess = guessableFromPolish[guessPl];
    if (!gameType || !unitType || !guessFrom || !guess) {
        return null;
    }

    const maxQuestionsString = params.get("max");
    let maxQuestions;
    if (maxQuestionsString === null) {
        maxQuestions = null;
    } else {
        maxQuestions = parseInt(maxQuestionsString);
        if (isNaN(maxQuestions) || maxQuestions < 1) {
            return null;
        }
    }

    const filterString = params.get("filtry");

    return {
        gameType,
        unitType,
        guessFrom,
        guess,
        maxQuestions,
        filters: decodeFilters(filterString),
    };
}

function decodeFilters(filterString: string | null): UnitFilters {
    const filters: UnitFilters = {
        countyTypes: [],
        voivodeships: [],
    };
    if (!filterString) {
        return filters;
    }

    const filterStrings = filterString.split(";");
    for (const str of filterStrings) {
        const [key, joinedValues] = str.split(":");
        const values = joinedValues.split(",");

        if (key === "typ") {
            for (const val of values) {
                const maybeCountyType = countyTypeFromPolish[val];
                if (maybeCountyType && !filters.countyTypes.includes(maybeCountyType)) {
                    filters.countyTypes.push(maybeCountyType);
                }
            }
        } else if (key === "woj") {
            for (const maybeVoivId of values) {
                if (voivodeshipIds.includes(maybeVoivId as VoivodeshipId)
                    && !filters.voivodeships.includes(maybeVoivId as VoivodeshipId)) {
                    filters.voivodeships.push(maybeVoivId as VoivodeshipId);
                }
            }
        }
    }

    return filters;
}

function flipObject<TKey extends string>(map: Record<TKey, string>): Record<string, TKey | undefined> {
    return Object.fromEntries(Object.entries<string>(map).map(([key, value]) => [value, key as TKey]));
}
