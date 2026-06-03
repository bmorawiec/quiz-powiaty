import { UnexpectedPropertyTypeError } from "src/data";
import type { GameOptions } from "src/game2/options";
import { generateMultipleAnswerQuestions, type Answers, type Question, type Questions } from "src/game2/questions";
import { toShuffled } from "src/utils/random";
import { contentGenerators } from "../contentGenerators";
import { fetchProperties, fetchUnits, filterByCountyType } from "./utils";

export async function optionsToMultipleAnswerQuestions(options: GameOptions): Promise<Questions & Answers> {
    const [questionContentGenerator, questionTags] = (options.mode === "dndGame" || options.mode === "typingGame")
        ? contentGenerators.shortQuestions(options)
        : contentGenerators.fullQuestions(options);
    const [answerContentGenerator, answerTags] = (options.mode === "promptGame" || options.mode === "typingGame")
        ? contentGenerators.textAnswers(options)
        : contentGenerators.richAnswers(options);

    // Whether or not questions should be sorted.
    const sortQuestions = ["dndGame", "typingGame"].includes(options.mode)
        && ["name", "capital", "plate"].includes(options.guessFrom);

    return generateMultipleAnswerQuestions({
        units: toShuffled(filterByCountyType(await fetchUnits(options), options)).slice(0, options.maxQuestions),
        properties: await fetchProperties(options, [...questionTags, ...answerTags]),
        questions: {
            tags: questionTags,
            contentGenerator: questionContentGenerator,
            sorter: (sortQuestions)
                // Sorts questions by content text or by text shown on license plates included in the content.
                ? (a: Question, b: Question) => {
                    if (a.content.type === "multiplePlates") {
                        if (b.content.type !== "multiplePlates") throw new UnexpectedPropertyTypeError();
                        return a.content.codes[0].localeCompare(b.content.codes[0]);
                    } else if (a.content.type === "text") {
                        if (b.content.type !== "text") throw new UnexpectedPropertyTypeError();
                        return a.content.text.localeCompare(b.content.text);
                    }
                    return 0;
                }
                : undefined,
        },
        answers: {
            tags: answerTags,
            contentGenerator: answerContentGenerator,
        },
    });
}
