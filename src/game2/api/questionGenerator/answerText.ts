import type { Unit } from "src/data/common";
import type { GameAPIOptions } from "../types";
import { getCOAURL, getFlagURL } from "./images";
import { TextFormatError } from "./error";

interface AnswerText {
    text: string;
    shortText: string;
    imageURL: string;
};

export function getAnswerText(unit: Unit, apiOptions: GameAPIOptions): AnswerText[] {
    if (apiOptions.guess === "name") {
        const prefix = (unit.type === "voivodeship")
            ? "województwo "
            : (unit.countyType === "city") ? "miasto " : "powiat ";
        return [{
            text: prefix + unit.name,
            shortText: unit.name,
            imageURL: "",
        }];
    } else if (apiOptions.guess === "capital") {
        return unit.capitals.map((capital) => ({
            text: capital,
            shortText: capital,
            imageURL: "",
        }));
    } else if (apiOptions.guess === "plate") {
        return unit.plates.map((plate) => ({
            text: plate,
            shortText: plate,
            imageURL: "",
        }))
    } else if (apiOptions.guess === "flag" || apiOptions.guess === "coa") {
        return [{
            text: "",
            shortText: "",
            imageURL: (apiOptions.guess === "flag") ? getFlagURL(unit) : getCOAURL(unit),
        }];
    } else if (apiOptions.guess === "map") {
        return [{
            text: "",
            shortText: "",
            imageURL: "",
        }];
    }
    throw new TextFormatError();
}
