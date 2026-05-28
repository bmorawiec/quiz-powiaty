import type { Content } from "./content";

export interface Answers {
    answers: Record<string, Answer | undefined>;
    answerIds: string[];
}

export interface Answer {
    /** A UUID. */
    id: string;
    /** Id of the question this is an answer to. */
    questionId: string;
    content: Content;
    /** Whether or not this is a correct answer. */
    correct: boolean;
    /** If true, then this answer has been correctly guessed. */
    guessed: boolean;
}

export class AnswerNotFoundError extends Error {
    name = "AnswerNotFoundError";

    constructor(id: string) {
        super("An answer with the specified id could not be found. Id was: " + id);
    }
}
