import { ArrowDownIcon, ArrowUpIcon } from "src/ui";
import type { Question } from "../../state";
import { useMemo, useState } from "react";

export interface QuestionBrowserProps {
    questions: Question[];
}

export function QuestionBrowser({ questions }: QuestionBrowserProps) {
    const [current, setCurrent] = useState(0);        // current question index
    const question = useMemo(() => questions[current], [current, questions]);
    const points = (question.tries < 3) ? 3 - question.tries : 0;

    const [answerText, imageURLs] = useMemo(() => {
        const textList: string[] = [];
        const imageURLs: string[] = [];
        for (const answer of question.answers) {
            if (answer.correct) {
                if (answer.text !== undefined) {
                    textList.push(answer.text);
                }
                if (answer.imageURL !== undefined) {
                    imageURLs.push(answer.imageURL);
                }
            }
        }

        const answerText = (textList.length > 0) ? textList.join(", ") : null;
        return [answerText, imageURLs];
    }, [question]);

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
                <h3 className="font-[550]">
                    Pytanie {current + 1}/{questions.length}: {question.text}
                </h3>
                {question.imageURL && (
                    <img
                        src={question.imageURL}
                        className="w-[100px]"
                    />
                )}
                <p>
                    Poprawna odpowiedź: {answerText}
                </p>
                {imageURLs.length > 0 && (
                    <div className="flex gap-[10px]">
                        {imageURLs.map((imageURL) =>
                            <img
                                src={imageURL}
                                className="w-[100px]"
                            />
                        )}
                    </div>
                )}
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
