import { generateMultipleAnswerQuestions, type Answers, type Question, type Questions } from "src/game2/questions";
import { toShuffled } from "src/utils/random";
import type { GameOptions } from "../types";
import { contentGenerators } from "./contentGenerators";
import { fetchProperties, fetchUnits, filterByCountyType } from "./utils";
import { UnexpectedPropertyTypeError } from "src/data";

export async function optionsToMultipleAnswerQuestions(options: GameOptions): Promise<Questions & Answers> {
    const [questionContentGenerator, questionTags] = (options.mode === "dndGame" || options.mode === "typingGame")
        ? contentGenerators.shortQuestions(options)
        : contentGenerators.fullQuestions(options);
    const [answerContentGenerator, answerTags] = (options.mode === "promptGame" || options.mode === "typingGame")
        ? contentGenerators.textAnswers(options)
        : contentGenerators.richAnswers(options);
    return generateMultipleAnswerQuestions({
        units: toShuffled(filterByCountyType(await fetchUnits(options), options)).slice(options.maxQuestions),
        properties: await fetchProperties(options, [...questionTags, ...answerTags]),
        questions: {
            tags: questionTags,
            contentGenerator: questionContentGenerator,
            sorter: (options.mode === "dndGame" || options.mode === "typingGame")
                ? (a: Question, b: Question) => {
                    if (a.content.type !== "text") throw new UnexpectedPropertyTypeError();
                    if (b.content.type !== "text") throw new UnexpectedPropertyTypeError();
                    return a.content.text.localeCompare(b.content.text);
                }
                : undefined,
        },
        answers: {
            tags: answerTags,
            contentGenerator: answerContentGenerator,
        },
    });
}
