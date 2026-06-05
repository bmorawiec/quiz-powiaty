import type { Content } from "./types";

/** If the provided content contains an image, then this function returns the URL of that image.
 *  Otherwise `null` is returned. */
export function retrieveImageURL(content: Content): string | null {
    if (content.type === "image" || content.type === "tallImage" || content.type === "textAndImage"
            || content.type === "titledImage") {
        return content.url;
    } else if (content.type === "textWithInlineImage") {
        return content.imageUrl;
    }
    return null;
}
