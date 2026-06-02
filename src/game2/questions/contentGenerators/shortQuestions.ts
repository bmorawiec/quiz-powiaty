import {
    PropertyNotFoundError,
    type ImageProperty,
    type PropertyTag,
    type ShapeProperty,
    type TextProperty,
} from "src/data";
import type { GameOptions } from "src/game2/options";
import type { ContentGenerator } from "src/game2/questions";

export function shortQuestions(options: GameOptions): [ContentGenerator, PropertyTag[]] {
    return {
        name: withName,
        capital: withCapitals,
        plate: withPlates,
        flag: withFlag,
        coa: withCOA,
        shape: withShape,
    }[options.guessFrom](options);
}

function withName(options: GameOptions): [ContentGenerator, PropertyTag[]] {
    if (options.guess === "coa" || options.guess === "flag") {
        return [(properties) => {
            const nameProperty = properties
                .find((property) => property.tag === "unambiguousName") as TextProperty | undefined;
            if (!nameProperty) throw new PropertyNotFoundError();

            return {
                type: "text",
                // Examples:
                // "powiat rzeszowski"
                // "województwo mazowieckie"
                text: nameProperty.text,
            };
        }, ["unambiguousName"]];
    } else {
        return [(properties) => {
            const nameProperty = properties
                .find((property) => property.tag === "unambiguousName") as TextProperty | undefined;
            const coaProperty = properties
                .find((property) => property.tag === "coa") as ImageProperty | undefined;
            if (!nameProperty) throw new PropertyNotFoundError();
            if (!coaProperty) throw new PropertyNotFoundError();

            return {
                type: "titledImage",
                // Examples:
                // "powiat rzeszowski" (coat of arms shown on the left)
                // "województwo mazowieckie" (coat of arms shown on the left)
                url: coaProperty.url,
                text: nameProperty.text,
            };
        }, ["unambiguousName", "coa"]];
    }
}

function withCapitals(_options: GameOptions): [ContentGenerator, PropertyTag[]] {
    return [(properties) => {
        const capitalProperties = properties.filter((property) => property.tag === "capital") as TextProperty[];
        if (capitalProperties.length === 0) throw new PropertyNotFoundError();

        return {
            type: "text",
            // Examples:
            // "Bydgoszcz, Toruń"
            // "Rzeszów"
            text: capitalProperties.map((property) => property.text).join(", "),
        };
    }, ["capital"]];
}

function withPlates(_options: GameOptions): [ContentGenerator, PropertyTag[]] {
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
    return [(properties) => {
        const flagProperty = properties.find((property) => property.tag === "flag") as ImageProperty | undefined;
        if (!flagProperty) throw new PropertyNotFoundError();

        return {
            type: "image",
            url: flagProperty.url,
        };
    }, ["flag"]];
}

function withCOA(_options: GameOptions): [ContentGenerator, PropertyTag[]] {
    return [(properties) => {
        const coaProperty = properties.find((property) => property.tag === "coa") as ImageProperty | undefined;
        if (!coaProperty) throw new PropertyNotFoundError();

        return {
            type: "image",
            url: coaProperty.url,
        };
    }, ["coa"]];
}

function withShape(_options: GameOptions): [ContentGenerator, PropertyTag[]] {
    return [(properties) => {
        const shapeProperty = properties.find((property) => property.tag === "shape") as ShapeProperty | undefined;
        if (!shapeProperty) throw new PropertyNotFoundError();

        return {
            type: "shape",
            shape: shapeProperty.shape,
        };
    }, ["shape"]];
}
