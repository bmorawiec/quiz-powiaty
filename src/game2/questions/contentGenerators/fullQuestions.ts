import {
    PropertyNotFoundError,
    type ImageProperty,
    type PropertyTag,
    type ShapeProperty,
    type TextProperty,
} from "src/data";
import type { ContentGenerator } from "src/game2/questions";
import type { GameOptions, Guessable, UnitType } from "src/game2/options";

export function fullQuestions(options: GameOptions): [ContentGenerator, PropertyTag[]] {
    return {
        name: withName,
        capital: withCapitals,
        plate: withPlates,
        flag: withFlag,
        coa: withCOA,
        shape: withShape,
    }[options.guessFrom](options);
}

const UNIT_TYPES: Record<UnitType, string> = {
    county: "powiat",
    voivodeship: "województwo",
};

const QUESTION_PREFIXES: Record<Guessable, string> = {
    name: "Jak się nazywa",
    capital: "Jaką stolicę ma",
    plate: "Jakie rejestracje ma",
    flag: "Jaką flagę ma",
    coa: "Jaki herb ma",
    shape: "Jaki kształt ma",
};

function withName(options: GameOptions): [ContentGenerator, PropertyTag[]] {
    if (options.guess === "coa" || options.guess === "flag") {
        return [(properties) => {
            const nameProperty = properties
                .find((property) => property.tag === "unambiguousName") as TextProperty | undefined;
            if (!nameProperty) throw new PropertyNotFoundError();

            return {
                type: "text",
                // Examples:
                // "Jaki herb ma powiat rzeszowski?"
                // "Jaką stolicę ma województwo mazowieckie?"
                text: QUESTION_PREFIXES[options.guess] + " " + nameProperty.text + "?",
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
                type: "textWithInlineImage",
                // Examples:
                // "Jaki herb ma powiat rzeszowski?" (coat of arms shown on the left)
                // "Jaką stolicę ma województwo mazowieckie?" (coat of arms shown on the left)
                beforeText: QUESTION_PREFIXES[options.guess] + " ",
                imageUrl: coaProperty.url,
                text: nameProperty.text,
                afterText: "?",
            };
        }, ["unambiguousName", "coa"]];
    }
}

function withCapitals(options: GameOptions): [ContentGenerator, PropertyTag[]] {
    return [(properties) => {
        const capitalProperties = properties.filter((property) => property.tag === "capital") as TextProperty[];
        if (capitalProperties.length === 0) throw new PropertyNotFoundError();

        const questionSuffix = (capitalProperties.length === 1)
            ? "ze stolicą w mieście " + capitalProperties[0].text
            : "ze stolicami w miastach " + capitalProperties.map((property) => property.text).join(", ");
        return {
            type: "text",
            // Examples:
            // "Jak się nazywa województwo ze stolicami w miastach Bydgoszcz, Toruń?"
            // "Jaką rejestrację ma powiat ze stolicą w mieście Rzeszów?"
            text: QUESTION_PREFIXES[options.guess] + " " + UNIT_TYPES[options.unitType] + " "
                + questionSuffix + "?",
        };
    }, ["capital"]];
}

function withPlates(options: GameOptions): [ContentGenerator, PropertyTag[]] {
    return [(properties) => {
        const plateProperties = properties.filter((property) => property.tag === "plate") as TextProperty[];
        if (plateProperties.length === 0) throw new PropertyNotFoundError();

        return {
            type: "textAndMultiplePlates",
            // Examples:
            // "Jak się nazywa województwo z tymi rejestracjami?" (plates will be displayed below the text)
            // "Jaką flagę ma powiat z tymi rejestracjami?" (plates will be displayed below the text)
            text: QUESTION_PREFIXES[options.guess] + " " + UNIT_TYPES[options.unitType] + " z tymi rejestracjami?",
            codes: plateProperties.map((property) => property.text),
        };
    }, ["plate"]];
}

function withFlag(options: GameOptions): [ContentGenerator, PropertyTag[]] {
    return [(properties) => {
        const flagProperty = properties.find((property) => property.tag === "flag") as ImageProperty | undefined;
        if (!flagProperty) throw new PropertyNotFoundError();

        return {
            type: "textAndImage",
            // Examples:
            // "Jak się nazywa województwo z tą flagą?"
            // "Jaką stolicę ma powiat z tą flagą?"
            text: QUESTION_PREFIXES[options.guess] + " " + UNIT_TYPES[options.unitType] + " z tą flagą?",
            url: flagProperty.url,
        };
    }, ["flag"]];
}

function withCOA(options: GameOptions): [ContentGenerator, PropertyTag[]] {
    return [(properties) => {
        const coaProperty = properties.find((property) => property.tag === "coa") as ImageProperty | undefined;
        if (!coaProperty) throw new PropertyNotFoundError();

        return {
            type: "textAndImage",
            // Examples:
            // "Jak się nazywa województwo z tym herbem?"
            // "Jaką stolicę ma powiat z tym herbem?"
            text: QUESTION_PREFIXES[options.guess] + " " + UNIT_TYPES[options.unitType] + " z tym herbem?",
            url: coaProperty.url,
        };
    }, ["coa"]];
}

function withShape(options: GameOptions): [ContentGenerator, PropertyTag[]] {
    return [(properties) => {
        const shapeProperty = properties.find((property) => property.tag === "shape") as ShapeProperty | undefined;
        if (!shapeProperty) throw new PropertyNotFoundError();

        return {
            type: "textAndShape",
            // Examples:
            // "Jak się nazywa województwo o tym kształcie?"
            // "Jaką stolicę ma powiat o tym kształcie?"
            text: QUESTION_PREFIXES[options.guess] + " " + UNIT_TYPES[options.unitType] + " o tym kształcie?",
            shape: shapeProperty.shape,
        };
    }, ["shape"]];
}
