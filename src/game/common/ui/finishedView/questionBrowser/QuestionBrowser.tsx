import { ArrowDownIcon, ArrowUpIcon } from "src/ui";
import type { Question } from "../../../state";
import { useMemo, useState } from "react";
import type { GameOptions } from "src/gameOptions";
import { QuestionAnswers } from "./QuestionAnswers";

export interface QuestionBrowserProps {
    questions: Question[];
    options: GameOptions;
}

export function QuestionBrowser({ questions, options }: QuestionBrowserProps) {
    const [current, setCurrent] = useState(0);        // current question index
    const question = useMemo(() => questions[current], [current, questions]);
    const points = (question.tries < 3) ? 3 - question.tries : 0;

    const handlePrevClick = () => {
        if (current > 0) {
            setCurrent(current - 1);
        }
    };

    const handleNextClick = () => {
        if (current < questions.length - 1) {
            setCurrent(current + 1);
        }
    };

    return (
        <div className="flex rounded-[10px] border bg-white border-gray-15 dark:bg-gray-95 dark:border-gray-80">
            <div className="flex-1 flex flex-col px-[22px] pt-[18px] pb-[16px] gap-[4px]">
                {(options.guessFrom === "flag" || options.guessFrom === "coa") ? (<>
                    <h3 className="font-[550]">
                        Pytanie {current + 1}/{questions.length}
                    </h3>
                    <img
                        src={question.value}
                        className="w-[100px]"
                    />
                </>) : (
                    <h3 className="font-[550]">
                        Pytanie {current + 1}/{questions.length}: {question.value}
                    </h3>
                )}

                <QuestionAnswers
                    question={question}
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

            <div className="flex flex-col w-[80px] border-l border-gray-15 dark:border-gray-80">
                <button
                    className="flex-1 px-[4px] pt-[7px] pr-[7px] group cursor-pointer rounded-[2px] focus-ring"
                    onClick={handlePrevClick}
                >
                    <div className="size-full flex items-center justify-center rounded-[6px]
                        transition-colors duration-80 group-hover:bg-gray-5 group-active:bg-gray-10
                        dark:group-hover:bg-gray-90 dark:group-active:bg-gray-85">
                        <ArrowUpIcon/>
                    </div>
                </button>

                <button
                    className="flex-1 pl-[4px] pb-[7px] pr-[7px] group cursor-pointer rounded-[2px] focus-ring"
                    onClick={handleNextClick}
                >
                    <div className="size-full flex items-center justify-center rounded-[6px]
                        transition-colors duration-80 group-hover:bg-gray-5 group-active:bg-gray-10
                        dark:group-hover:bg-gray-90 dark:group-active:bg-gray-85">
                        <ArrowDownIcon/>
                    </div>
                </button>
            </div>
        </div>
    );
}
