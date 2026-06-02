import type { Answers, Questions } from "src/game2/questions";
import type { GameOptions } from "../types";
import { optionsToMultipleAnswerQuestions } from "./multipleAnswerQuestions";
import { optionsToSingleAnswerQuestions } from "./singleAnswerQuestions";

export async function optionsToQuestions(options: GameOptions): Promise<Questions & Answers> {
    if (options.mode === "choiceGame") {
        return optionsToSingleAnswerQuestions(options);
    } else if (options.mode === "dndGame" || options.mode === "promptGame" || options.mode === "typingGame") {
        return optionsToMultipleAnswerQuestions(options);
    }
    throw new Error("Game mode not supported.");
}
