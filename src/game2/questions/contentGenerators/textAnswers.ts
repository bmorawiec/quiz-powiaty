import {
    PropertyNotFoundError,
    type PropertyTag,
    type TextProperty,
} from "src/data";
import type { GameOptions } from "src/game2/options";
import type { ContentGenerator } from "src/game2/questions";

export function textAnswers(options: GameOptions): [ContentGenerator, PropertyTag[]] {
    return {
        name: withName,
        capital: withCapitals,
        plate: withPlates,
        flag: withFlag,
        coa: withCOA,
        shape: withShape,
    }[options.guess](options);
}

function withName(_options: GameOptions): [ContentGenerator, PropertyTag[]] {
    return [(properties) => {
        const nameProperty = properties.find((property) => property.tag === "shortName") as TextProperty | undefined;
        if (!nameProperty) throw new PropertyNotFoundError();

        return {
            type: "text",
            // Example:
            // "rzeszowski"
            // "mazowieckie"
            text: nameProperty.text,
        };
    }, ["shortName"]];
}

function withCapitals(_options: GameOptions): [ContentGenerator, PropertyTag[]] {
    return [(properties) => {
        const capitalProperties = properties.filter((property) => property.tag === "capital") as TextProperty[];
        if (capitalProperties.length === 0) throw new PropertyNotFoundError();

        return {
            type: "text",
            // Example:
            // "Rzeszów" for Rzeszów county
            // "Bydgoszcz, Toruń" for kujawsko-pomorskie voivodeship
            text: capitalProperties.map((property) => property.text).join(", "),
        };
    }, ["capital"]];
}

function withPlates(_options: GameOptions): [ContentGenerator, PropertyTag[]] {
    return [(properties) => {
        const plateProperties = properties.filter((property) => property.tag === "plate") as TextProperty[];
        if (plateProperties.length === 0) throw new PropertyNotFoundError();

        return {
            type: "text",
            // Example:
            // "KR" for Kraków county
            // "RKR, YKR" for Krosno county in the podkarpackie voivodeship
            text: plateProperties.map((property) => property.text).join(", "),
        };
    }, ["plate"]];
}

function withFlag(_options: GameOptions): [ContentGenerator, PropertyTag[]] {
    throw new Error("Cannot generate text content based on the flag of an administrative unit.");
}

function withCOA(_options: GameOptions): [ContentGenerator, PropertyTag[]] {
    throw new Error("Cannot generate text content based on the coat of arms of an administrative unit.");
}

function withShape(_options: GameOptions): [ContentGenerator, PropertyTag[]] {
    throw new Error("Cannot generate text content based on the shape of an administrative unit.");
}
