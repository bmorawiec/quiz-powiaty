import { ArrowDownIcon, ArrowUpIcon } from "src/ui";

export interface QuestionBrowserBaseProps {
    /** The index of the currently displayed question */
    current: number;
    /** The number of questions that were presented in the game */
    total: number;
    questionText: string;
    answerText: string;
    /** How many tries were made while guessing */
    tries: number;
    onPrevClick: () => void;
    onNextClick: () => void;
}

export function QuestionBrowserBase({
    current,
    total,
    questionText,
    answerText,
    tries,
    onPrevClick,
    onNextClick,
}: QuestionBrowserBaseProps) {
    const points = (tries < 3) ? 3 - tries : 0;

    return (
        <div className="flex rounded-[10px] border bg-white border-gray-15">
            <div className="flex-1 flex flex-col px-[22px] pt-[18px] pb-[16px] gap-[4px]">
                <h3 className="font-[550]">
                    Pytanie {current + 1}/{total}: {questionText}
                </h3>
                <p>
                    Poprawna odpowiedź: {answerText}
                </p>
                <div className="flex gap-[4px] max-xs:flex-col justify-between">
                    <p>
                        Otrzymanych punktów: {points}/3
                    </p>

                    <p>
                        Zgadnięto za {tries + 1}. razem
                    </p>
                </div>
            </div>

            <div className="flex flex-col w-[80px] border-l border-gray-15">
                <button
                    className="flex-1 px-[4px] pt-[7px] pr-[7px] group cursor-pointer rounded-[2px] focus-ring"
                    onClick={onPrevClick}
                >
                    <div className="size-full flex items-center justify-center rounded-[6px]
                        transition-colors duration-80 group-hover:bg-gray-5 group-active:bg-gray-10">
                        <ArrowUpIcon/>
                    </div>
                </button>

                <button
                    className="flex-1 pl-[4px] pb-[7px] pr-[7px] group cursor-pointer rounded-[2px] focus-ring"
                    onClick={onNextClick}
                >
                    <div className="size-full flex items-center justify-center rounded-[6px]
                        transition-colors duration-80 group-hover:bg-gray-5 group-active:bg-gray-10">
                        <ArrowDownIcon/>
                    </div>
                </button>
            </div>
        </div>
    );
}
