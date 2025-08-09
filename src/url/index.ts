import { UNIT_TAGS, type Guessable, type UnitTag, type UnitType } from "src/data";
import type { GameOptions, GameType, UnitFilter, UnitFilterMode } from "src/game/common";

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

const gameTypeFromPolish = flipObject(gameTypeToPolish);
const unitTypeFromPolish = flipObject(unitTypeToPolish);
const guessableFromPolish = flipObject(guessableToPolish);

/** Encodes game options into an URL. */
export function encodeGameURL(options: GameOptions): string {
    let url = "/graj"
        + "?tryb=" + gameTypeToPolish[options.gameType]
        + "&typ=" + unitTypeToPolish[options.unitType]
        + "&dane=" + guessableToPolish[options.guessFrom]
        + "&zgadnij=" + guessableToPolish[options.guess];

    if (options.filters.length > 0) {
        url += "&filtry=" + encodeFilters(options.filters);
    }

    return url;
}

function encodeFilters(filters: UnitFilter[]): string {
    return filters
        .map((filter) => (filter.mode === "exclude") ? "-" + filter.tag : filter.tag)
        .join(",");
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

    const filterString = params.get("filtry");

    return {
        gameType,
        unitType,
        guessFrom,
        guess,
        filters: decodeFilters(filterString),
    };
}

function decodeFilters(filterString: string | null): UnitFilter[] {
    if (!filterString) {
        return [];
    }

    const filterStrings = filterString.split(",");
    const filters: UnitFilter[] = [];
    for (const str of filterStrings) {
        let mode: UnitFilterMode;
        let maybeTag;
        if (str[0] === "-") {
            mode = "exclude";
            maybeTag = str.slice(1);
        } else {
            mode = "include";
            maybeTag = str;
        }
        if (UNIT_TAGS.includes(maybeTag as UnitTag)) {
            filters.push({
                tag: maybeTag as UnitTag,
                mode,
            });
        }
    }

    return filters;
}

function flipObject<TKey extends string>(map: Record<TKey, string>): Record<string, TKey | undefined> {
    return Object.fromEntries(Object.entries<string>(map).map(([key, value]) => [value, key as TKey]));
}
