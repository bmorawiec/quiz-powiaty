export class PromptStateNotFoundError extends Error {
    name = "PromptStateNotFoundError";

    constructor(promptId: string) {
        super("Couldn't find state of prompt with ID: " + promptId);
    }
}
