import type { GameOptions } from "src/gameOptions";
import { type Answer, type Question } from "../../../state";
import { QuestionAnswers } from "./QuestionAnswers";

export interface QuestionCardProps {
    question: Question;
    questionIndex: number;
    correctAnswers: Answer[];
    options: GameOptions;
}

export function QuestionCard({ question, questionIndex, correctAnswers, options }: QuestionCardProps) {
    const points = (question.tries < 3) ? 3 - question.tries : 0;

    return (
        <div className="flex flex-col px-[22px] pt-[18px] pb-[16px] gap-[4px] rounded-[10px] border
            bg-white border-gray-15 dark:bg-gray-95 dark:border-gray-80">
            {(options.guessFrom === "flag" || options.guessFrom === "coa") ? (<>
                <h3 className="font-[550]">
                    Pytanie {questionIndex + 1}.
                </h3>
                <img
                    src={question.value}
                    className="w-[100px]"
                />
            </>) : (
                <h3 className="font-[550]">
                    Pytanie {questionIndex + 1}. {question.value}
                </h3>
            )}

            <QuestionAnswers
                answers={correctAnswers}
                options={options}
            />

            <div className="flex gap-[4px] max-xs:flex-col justify-between">
                <p>
                    Otrzymanych punktów: {points}/3
                </p>
                <p>
                    Zgadnięto za {question.tries + 1}. razem
                </p>
            </div>
        </div>
    );
}
