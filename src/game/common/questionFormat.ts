import { getUnambiguousName, type Guessable, type Unit } from "src/data";
import type { GameOptions } from "./gameOptions";


/** Supported template entries:
 *  %capitals   comma-separated list of capitals
 *  %plates     comma-separated list of car plate prefixes
 *  %prefix     (Jak się nazywa | Jaką stolicę ma | Jakie rejestracje ma | Jaką flagę ma | Jaki herb ma | Znajdź)
 *  %thisType   (to województwo | ten powiat)
 *  %type       (województwo | powiat)
 *  %type|countyType            (województwo | powiat | miasto)
 *  %withCapitalsInCities?      (ze stolicą w mieście | ze stolicami w mieście) or empty string
 *  %unambigName                disambiguated county/voivodeship name
 *  %??                         question mark or empty string */
const templates: Record<Guessable, string[]> = {
    name: ["%prefix", " ", "%type|countyType", " ", "%unambigName", "%??"],
    capital: ["%prefix", " ", "%type|countyType", " ", "%withCapitalsInCities?", " ", "%capitals", "%??"],
    plate: ["%prefix", " ", "%type", " z rejestracjami ", "%plates", "%??"],
    flag: ["%prefix", " ", "%type", " z tą flagą", "%??"],
    coa: ["%prefix", " ", "%type", " z tym herbem", "%??"],
    map: ["%prefix", " ", "%thisType", "%??"],
};

/** Returns a string containing the a question about the provided administrative unit,
 *  based on the specified game options. */
export function formatQuestion(unit: Unit, options: GameOptions): string {
    const template = templates[options.guessFrom];
    return template
        .map((entry) => {
            if (entry === "%capitals") {
                return unit.capitals.join(", ");
            } else if (entry === "%plates") {
                return unit.plates.join(", ");
            } else if (entry === "%prefix") {
                if (options.guess === "name") {
                    return "Jak się nazywa";
                } else if (options.guess === "capital") {
                    return "Jaką stolicę ma";
                } else if (options.guess === "plate") {
                    return "Jakie rejestracje ma";
                } else if (options.guess === "flag") {
                    return "Jaką flagę ma";
                } else if (options.guess === "coa") {
                    return "Jaki herb ma";
                } else if (options.guess === "map") {
                    return "Znajdź";
                }
            } else if (entry === "%thisType") {
                return (options.unitType === "voivodeship") ? "to województwo" : "ten powiat";
            } else if (entry === "%type") {
                return (options.unitType === "voivodeship") ? "województwo" : "powiat";
            } else if (entry === "%type|countyType") {
                if (unit.type === "county") {
                    if (unit.countyType === "city") {
                        return "miasto";
                    }
                    return "powiat";
                }
                return "województwo";
            } else if (entry === "%withCapitalsInCities?") {
                if (unit.countyType === "city") {
                    return "";
                }
                return (unit.capitals.length > 1) ? "ze stolicami w miastach" : "ze stolicą w mieście";
            } else if (entry === "%unambigName") {
                return getUnambiguousName(unit);
            } else if (entry === "%??") {
                return (options.guess === "map") ? "" : "?";
            }
            return entry;
        })
        .join("");
}
