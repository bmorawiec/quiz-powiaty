import type { Content } from "./content";

export const INITIAL_POINT_AMOUNT = 4;

export interface Questions {
    questions: Record<string, Question | undefined>;
    questionIds: string[];
}

export interface Question {
    /** A UUID. */
    id: string;
    contents: Content[];
    /** The amount of points awarded for this question.
     *  At first set to INITIAL_POINT_AMOUNT. Decreases with each incorrect guess. */
    points: number;
    /** Number of incorrect tries when guessing this question. */
    tries: number;
    /** Ids of the answers to this question. */
    answerIds: string[];
    /** Number of guessed answers. */
    numberGuessed: number;
    /** Number of correct answers. */
    numberCorrect: number;
    /** If true, then all the answers to this question have been correctly guessed. */
    guessed: boolean;
}

export class QuestionNotFoundError extends Error {
    name = "QuestionNotFoundError";

    constructor(id: string) {
        super("A question with the specified id could not be found. Id was: " + id);
    }
}
