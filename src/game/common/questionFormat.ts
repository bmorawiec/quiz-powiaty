import { type Unit } from "src/data/common";
import type { GameOptions } from "src/gameOptions";

/** Returns a string containing the a question about the provided administrative unit,
 *  based on the specified game options. */
export function formatQuestion(unit: Unit, { unitType, guessFrom, guess }: GameOptions) {
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
            } else if (guessFrom === "flag") {
                str += "ma tą flagę?";
            } else if (guessFrom === "coa") {
                str += "ma ten herb?";
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
            }
        }
        if (guess !== "map") {
            str += "?";
        }
    }
    return str;
}

export function formatTitle({ guess, guessFrom, unitType }: GameOptions): string {
    let str = "";
    if (guess === "name") {
        str += "Jak się nazywają ";
    } else if (guess === "capital") {
        str += "Jakie stolice mają ";
    } else if (guess === "plate") {
        str += "Jakie rejestracje mają ";
    } else if (guess === "flag") {
        str += "Jakie flagi mają ";
    } else if (guess === "coa") {
        str += "Jakie rejestracje mają ";
    } else if (guess === "map") {
        str += "Gdzie leżą ";
    }
    if (guessFrom === "name" || guessFrom === "map") {
        str += (unitType === "voivodeship") ? "te województwa?" : "te powiaty?";
    } else {
        str += (unitType === "voivodeship") ? "województwa " : "powiaty ";
        if (guessFrom === "capital") {
            str += "z tymi stolicami?";
        } else if (guessFrom === "plate") {
            str += "z tymi rejestracjami?";
        } else if (guessFrom === "flag") {
            str += "z tymi flagami?";
        } else if (guessFrom === "coa") {
            str += "z tymi herbami?";
        }
    }
    return str;
}

export function getQuestionText(unit: Unit, { guessFrom }: GameOptions): string | undefined {
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
    return undefined;
}
