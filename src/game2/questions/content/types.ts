export type Content =
    | TextContent
    | ImageContent
    | TallImageContent
    | TextAndImageContent
    | ShapeContent
    | TextAndShapeContent
    | TextWithInlineImageContent
    | PlateContent
    | TextAndPlateContent;

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

/** Displays a shape. */
export interface ShapeContent {
    type: "shape";
    shape: string;
}

/** Displays a shape and some text above that shape. */
export interface TextAndShapeContent {
    type: "textAndShape";
    shape: string;
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

/** Displays the provided text on a license plate. */
export interface PlateContent {
    type: "plate";
    code: string;
}

/** Displays a license plate with the provided code on it and some text above the plate. */
export interface TextAndPlateContent {
    type: "textAndPlate";
    text: string;
    code: string;
}
