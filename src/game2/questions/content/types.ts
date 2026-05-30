import type { Property } from "src/data";

export type ContentGenerator = (properties: Property[]) => Content;

export type Content =
    | TextContent
    | ImageContent
    | TallImageContent
    | TextAndImageContent
    | TitledImageContent
    | ShapeContent
    | TextAndShapeContent
    | TextWithInlineImageContent
    | MultiplePlatesContent
    | TextAndMultiplePlatesContent;

/** Displays the provided text. */
export interface TextContent {
    type: "text";
    text: string;
}

/** Displays an image loaded from the provided URL. */
export interface ImageContent {
    type: "image";
    url: string;
}

/** Displays an image loaded from the provided URL.
 *  Used to signify that the rendered image will be taller than wider. */
export interface TallImageContent {
    type: "tallImage";
    url: string;
}

/** Displays an image loaded from the provided URL and some text above that image. */
export interface TextAndImageContent {
    type: "textAndImage";
    text: string;
    url: string;
}

/** Displays an image on the left and a title in the center. */
export interface TitledImageContent {
    type: "titledImage",
    url: string;
    text: string;
}

/** Displays a shape. */
export interface ShapeContent {
    type: "shape";
    shape: number[][];
}

/** Displays a shape and some text above that shape. */
export interface TextAndShapeContent {
    type: "textAndShape";
    shape: number[][];
    text: string;
}

/** Displays a text containing (in order):
 *   1. the value of `beforeText`
 *   2. an image loaded from `imageUrl` inserted into the text
 *   3. the value of `text` in an accented color
 *   4. the value of `afterText` */
export interface TextWithInlineImageContent {
    type: "textWithInlineImage";
    beforeText: string;
    imageUrl: string;
    text: string;
    afterText: string;
}

/** Displays the provided strings on license plates. */
export interface MultiplePlatesContent {
    type: "multiplePlates";
    codes: string[];
}

/** Displays a list of license plates with the provided codes on them and some text above the plates. */
export interface TextAndMultiplePlatesContent {
    type: "textAndMultiplePlates";
    text: string;
    codes: string[];
}
