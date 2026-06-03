import type { GameOptions } from "src/game2/options";
import { generateSingleAnswerQuestions, type Answers, type Questions } from "src/game2/questions";
import { toShuffled } from "src/utils/random";
import { contentGenerators } from "../contentGenerators";
import {
    fetchProperties,
    fetchPropertiesFromAllVoivodeships,
    fetchUnits,
    fetchUnitsFromAllVoivodeships,
    filterByCountyType,
} from "./utils";

export async function optionsToSingleAnswerQuestions(options: GameOptions): Promise<Questions & Answers> {
    const [questionContentGenerator, questionTags] = contentGenerators.fullQuestions(options);
    const [answerContentGenerator, answerTags] = contentGenerators.richAnswers(options);
    return generateSingleAnswerQuestions({
        questions: {
            units: toShuffled(filterByCountyType(await fetchUnits(options), options)).slice(0, options.maxQuestions),
            properties: await fetchProperties(options, questionTags),
            tags: questionTags,
            contentGenerator: questionContentGenerator,
        },
        answers: {
            units: filterByCountyType(await fetchUnitsFromAllVoivodeships(options), options),
            properties: await fetchPropertiesFromAllVoivodeships(options, answerTags),
            tags: answerTags,
            contentGenerator: answerContentGenerator,
            howManyIncorrect: 5,
        },
    });
}
