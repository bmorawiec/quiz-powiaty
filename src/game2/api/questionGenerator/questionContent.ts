import { getUnambiguousName, type Unit } from "src/data/common";
import type { GameAPIOptions, QuestionContent } from "../types";
import { TextFormatError } from "./error";
import { getCOAURL, getFlagURL } from "./images";

function getQuestionText(unit: Unit, apiOptions: GameAPIOptions) {
    const { guessFrom, guess } = apiOptions;
    let str = "";
    if (guess === "name") {
        if (guessFrom === "map") {
            str += (unit.type === "voivodeship") ? "Które to województwo?" : "Który to powiat?";
        } else {
            str += (unit.type === "voivodeship") ? "Które województwo " : "Który powiat ";
            if (guessFrom === "capital") {
                str += (unit.capitals.length > 1) ? "ma stolice w miastach " : " ma stolicę w mieście ";
                str += unit.capitals.join(", ") + "?";
            } else if (guessFrom === "plate") {
                str += "ma rejestracje " + unit.plates.join(", ") + "?";
            } else {
                throw new TextFormatError();
            }
        }
    } else {
        if (guess === "capital") {
            str += "Jaką stolicę ma ";
        } else if (guess === "plate") {
            str += "Jakie rejestracje ma ";
        } else if (guess === "flag") {
            str += "Jaką flagę ma ";
        } else if (guess === "coa") {
            str += "Jaki herb ma ";
        } else if (guess === "map") {
            str += "Znajdź ";
        } else {
            throw new TextFormatError();
        }
        if (guessFrom === "map") {
            str += (unit.type === "voivodeship") ? "to województwo" : "ten powiat";
        } else {
            str += (unit.type === "voivodeship")
                ? "województwo "
                : (unit.countyType === "city") ? "miasto " : "powiat ";
            if (guessFrom === "name") {
                str += getUnambiguousName(unit);
            } else if (guessFrom === "capital") {
                str += (unit.capitals.length > 1) ? "ze stolicami w miastach " : "ze stolicą w mieście ";
                str += unit.capitals.join(", ");
            } else if (guessFrom === "plate") {
                str += "z rejestracjami " + unit.plates.join(", ");
            } else if (guessFrom === "flag") {
                str += "z tą flagą";
            } else if (guessFrom === "coa") {
                str += "z tym herbem";
            } else {
                throw new TextFormatError();
            }
        }
        if (guess !== "map") {
            str += "?";
        }
    }
    return str;
}

function getShortQuestionText(unit: Unit, apiOptions: GameAPIOptions): string {
    const { guessFrom } = apiOptions;
    if (guessFrom === "name") {
        const prefix = (unit.type === "voivodeship")
            ? "województwo "
            : (unit.countyType === "city") ? "miasto " : "powiat ";
        return prefix + getUnambiguousName(unit);
    } else if (guessFrom === "capital") {
        const suffix = (unit.countyType === "city")
            ? " (miasto)"
            : "";
        return unit.capitals.join(", ") + suffix;
    } else if (guessFrom === "plate") {
        return unit.plates.join(", ");
    }
    throw new TextFormatError();
}

function getQuestionImageURL(unit: Unit, apiOptions: GameAPIOptions): string {
    if (apiOptions.guessFrom === "flag") {
        return getFlagURL(unit);
    } else if (apiOptions.guessFrom === "coa") {
        return getCOAURL(unit);
    }
    throw new TextFormatError();
}

export function getQuestionContent(unit: Unit, apiOptions: GameAPIOptions): QuestionContent {
    const common = {
        text: getQuestionText(unit, apiOptions),
        shortText: getShortQuestionText(unit, apiOptions),
    };
    if (["name", "capital", "plate"].includes(apiOptions.guessFrom)) {
        return {
            type: "text",
            ...common,
        };
    } else if (["flag", "coa"].includes(apiOptions.guessFrom)) {
        return {
            type: "image",
            ...common,
            url: getQuestionImageURL(unit, apiOptions),
        };
    } else if (apiOptions.guessFrom === "map") {
        return {
            type: "feature",
            ...common,
            unitId: unit.id,
        };
    } else {
        throw new Error("Unknown value for `apiOptions.guessFrom`.");
    }
}
