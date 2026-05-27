export type Content = TextContent | ImageContent | ShapeContent;

export interface TextContent {
    type: "text";
    text: string;
}

export interface ImageContent {
    type: "image";
    url: string;
}

export interface ShapeContent {
    type: "shape";
    shape: number[][];
}
