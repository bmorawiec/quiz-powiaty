import type { Unit } from "src/data/common";
import type { AnswerContent, GameAPIOptions, TextAnswerContent } from "../types";
import { TextFormatError } from "./error";
import { getCOAURL, getFlagURL } from "./images";

/** Returns an array of correct answer content objects for the provided unit. */
export function getAnswerContents(unit: Unit, apiOptions: GameAPIOptions): AnswerContent[] {
    if (apiOptions.guess === "name") {
        const prefix = (unit.type === "voivodeship")
            ? "województwo "
            : (unit.countyType === "city") ? "miasto " : "powiat ";
        return [{
            type: "text",
            text: prefix + unit.name,
            shortText: unit.name,
        }];
    } else if (apiOptions.guess === "capital") {
        return unit.capitals.map((capital) => ({
            type: "text",
            text: capital,
            shortText: capital,
        }));
    } else if (apiOptions.guess === "plate") {
        return unit.plates.map((plate) => ({
            type: "text",
            text: plate,
            shortText: plate,
        }));
    } else if (apiOptions.guess === "flag" || apiOptions.guess === "coa") {
        return [{
            type: "image",
            url: (apiOptions.guess === "flag") ? getFlagURL(unit) : getCOAURL(unit),
        }];
    } else if (apiOptions.guess === "map") {
        return [{
            type: "feature",
            unitId: unit.id,
        }];
    }
    throw new TextFormatError();
}

/** Condenses all the provided answer content objects into a single answer content object.
 *  The text stored in the object will consist of strings stored in the provided objects, separated by commas. */
export function squishTextAnswerContent(contentList: TextAnswerContent[]): TextAnswerContent {
    const textList: string[] = [];
    const shortTextList: string[] = [];
    for (const content of contentList) {
        textList.push(content.text);
        shortTextList.push(content.shortText);
    }
    return {
        type: "text",
        text: textList.join(", "),
        shortText: shortTextList.join(", "),
    };
}
