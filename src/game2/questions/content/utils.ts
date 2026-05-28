import type { Content, ContentWithText } from "./types";

export function hasText(content: Content): content is ContentWithText {
    return ["text", "textAndImage", "textAndShape", "textWithInlineImage", "textAndPlate"].includes(content.type);
}
