import {
    PropertyNotFoundError,
    type ImageProperty,
    type PropertyTag,
    type ShapeProperty,
    type TextProperty,
} from "src/data";
import type { ContentGenerator } from "src/game2/questions";
import type { GameOptions } from "src/game2/options";

export function richAnswers(options: GameOptions): [ContentGenerator, PropertyTag[]] {
    return {
        name: withName,
        capital: withCapitals,
        plate: withPlates,
        flag: withFlag,
        coa: withCOA,
        shape: withShape,
    }[options.guess](options);
}

function withName(options: GameOptions): [ContentGenerator, PropertyTag[]] {
    if (options.guessFrom === "coa" || options.guessFrom === "flag") {
        // Don't include the coat of arms in the answer when guessing from the CoA or the flag.
        return [(properties) => {
            const nameProperty = properties
                .find((property) => property.tag === "unambiguousName") as TextProperty | undefined;
            if (!nameProperty) throw new PropertyNotFoundError();

            return {
                type: "text",
                text: nameProperty.text,
            };
        }, ["unambiguousName"]];
    } else {
        // Generates answers containing the coat of arms of the voivodeship/county and its name.
        return [(properties) => {
            const nameProperty = properties
                .find((property) => property.tag === "unambiguousName") as TextProperty | undefined;
            const coaProperty = properties
                .find((property) => property.tag === "coa") as ImageProperty | undefined;
            if (!nameProperty) throw new PropertyNotFoundError();
            if (!coaProperty) throw new PropertyNotFoundError();

            return {
                type: "titledImage",
                url: coaProperty.url,
                text: nameProperty.text,
            };
        }, ["unambiguousName", "coa"]];
    }
}

function withCapitals(_options: GameOptions): [ContentGenerator, PropertyTag[]] {
    // Generates answers containing a list of the names of the capital cities.
    return [(properties) => {
        const capitalProperties = properties.filter((property) => property.tag === "capital") as TextProperty[];
        if (capitalProperties.length === 0) throw new PropertyNotFoundError();

        return {
            type: "text",
            text: capitalProperties.map((property) => property.text).join(", "),
        };
    }, ["capital"]];
}

function withPlates(_options: GameOptions): [ContentGenerator, PropertyTag[]] {
    // Generates answers containing a list of the license plate codes this unit uses.
    return [(properties) => {
        const plateProperties = properties.filter((property) => property.tag === "plate") as TextProperty[];
        if (plateProperties.length === 0) throw new PropertyNotFoundError();

        return {
            type: "multiplePlates",
            codes: plateProperties.map((property) => property.text),
        };
    }, ["plate"]];
}

function withFlag(_options: GameOptions): [ContentGenerator, PropertyTag[]] {
    // Generates answers containing the flag of this unit.
    return [(properties) => {
        const property = properties.find((property) => property.tag === "flag") as ImageProperty | undefined;
        if (!property) throw new PropertyNotFoundError();

        return {
            type: "image",
            url: property.url,
        };
    }, ["flag"]];
}

function withCOA(_options: GameOptions): [ContentGenerator, PropertyTag[]] {
    // Generates answers containing the coa of this unit.
    return [(properties) => {
        const property = properties.find((property) => property.tag === "coa") as ImageProperty | undefined;
        if (!property) throw new PropertyNotFoundError();

        return {
            type: "tallImage",
            url: property.url,
        };
    }, ["coa"]]
}

function withShape(_options: GameOptions): [ContentGenerator, PropertyTag[]] {
    // Generates answers containing the shape of this unit.
    return [(properties) => {
        const shapeProperty = properties.find((property) => property.tag === "shape") as ShapeProperty | undefined;
        if (!shapeProperty) throw new PropertyNotFoundError();

        return {
            type: "shape",
            shape: shapeProperty.shape,
        };
    }, ["shape"]];
}
