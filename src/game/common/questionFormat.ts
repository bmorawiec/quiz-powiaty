import { type Unit } from "src/data/common";
import type { GameOptions } from "src/gameOptions";

class FormatError extends Error {
    name = "FormatError";

    constructor() {
        super("No format matching the provided game options.");
    }
}

/** Returns a string containing the a question about the provided administrative unit,
 *  based on the specified game options. */
export function formatQuestion(unit: Unit, options: GameOptions) {
    const { guessFrom, guess, unitType } = options;
    let str = "";
    if (guess === "name") {
        if (guessFrom === "map") {
            str += (unitType === "voivodeship") ? "Które to województwo?" : "Który to powiat?";
        } else {
            str += (unitType === "voivodeship") ? "Które województwo " : "Który powiat ";
            if (guessFrom === "capital") {
                str += (unit.capitals.length > 1) ? "ma stolice w miastach " : " ma stolicę w mieście ";
                str += unit.capitals.join(", ") + "?";
            } else if (guessFrom === "plate") {
                str += "ma rejestracje " + unit.plates.join(", ") + "?";
            } else {
                throw new FormatError();
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
            throw new FormatError();
        }
        if (guessFrom === "map") {
            str += (unitType === "voivodeship") ? "to województwo" : "ten powiat";
        } else {
            str += (unitType === "voivodeship")
                ? "województwo "
                : (unit.countyType === "city") ? "miasto " : "powiat ";
            if (guessFrom === "name") {
                str += unit.name;
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
                throw new FormatError();
            }
        }
        if (guess !== "map") {
            str += "?";
        }
    }
    return str;
}

export function formatTitle(options: GameOptions, plural?: boolean): string {
    const { guessFrom, guess, unitType } = options;
    let str = "";
    if (guess === "name") {
        str += (plural) ? "Jak się nazywają " : "Jak się nazywa ";
    } else if (guess === "capital") {
        str += (plural) ? "Jakie stolice mają " : "Jakie stolice ma ";
    } else if (guess === "plate") {
        str += (plural) ? "Jakie rejestracje mają " : "Jakie rejestracje ma ";
    } else if (guess === "flag") {
        str += (plural) ? "Jakie flagi mają " : "Jaką flagę ma ";
    } else if (guess === "coa") {
        str += (plural) ? "Jakie rejestracje mają " : "Jakie rejestracje ma ";
    } else if (guess === "map") {
        str += (plural) ? "Gdzie leżą " : "Gdzie leży ";
    } else {
        throw new FormatError();
    }
    if (guessFrom === "name" || guessFrom === "map") {
        str += (unitType === "voivodeship")
            ? (plural) ? "te województwa?" : "to województwo?"
            : (plural) ? "te powiaty?" : "ten powiat";
    } else {
        str += (unitType === "voivodeship")
            ? (plural) ? "województwa " : "województwo "
            : (plural) ? "powiaty " : "powiat ";
        if (guessFrom === "capital") {
            str += "z tymi stolicami?";
        } else if (guessFrom === "plate") {
            str += "z tymi rejestracjami?";
        } else if (guessFrom === "flag") {
            str += (plural) ? "z tymi flagami?" : "z tą flagą?";
        } else if (guessFrom === "coa") {
            str += (plural) ? "z tymi herbami?" : "z tym herbem?";
        } else {
            throw new FormatError();
        }
    }
    return str;
}

export function getQuestionText(unit: Unit, options: GameOptions): string {
    const { guessFrom } = options;
    if (guessFrom === "name") {
        const prefix = (unit.type === "voivodeship")
            ? "województwo "
            : (unit.countyType === "city") ? "miasto " : "powiat ";
        return prefix + unit.name;
    } else if (guessFrom === "capital") {
        const suffix = (unit.countyType === "city")
            ? " (miasto)"
            : "";
        return unit.capitals.join(", ") + suffix;
    } else if (guessFrom === "plate") {
        return unit.plates.join(", ");
    }
    throw new FormatError();
}
