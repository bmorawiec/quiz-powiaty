import { type Unit } from "src/data";
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
                str += (unit.capitals.length > 0) ? "ma stolice w miastach " : " ma stolicę w mieście ";
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
                str += (unit.capitals.length > 0) ? "ze stolicami w miastach " : "ze stolicą w mieście ";
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
