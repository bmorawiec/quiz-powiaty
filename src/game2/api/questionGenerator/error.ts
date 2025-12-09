export class TextFormatError extends Error {
    name = "TextFormatError";

    constructor() {
        super("No format matching the provided API options.");
    }
}
