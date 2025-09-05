import { useEffect, useMemo } from "react";
import type { GameOptions } from "src/gameOptions";
import { useTypingGameStore } from "../state";
import { Card } from "./card";
import { focusNextInput } from "src/utils/focusNextInput";

export interface ViewProps {
    options: GameOptions;
}

export function View({ options }: ViewProps) {
    const title = useTypingGameStore((state) => state.title);

    const total = useTypingGameStore((state) => state.questions.length);
    const [firstHalf, secondHalf] = useMemo(() => {
        const firstHalfLength = Math.ceil(total / 2);
        const firstHalf = [];
        for (let index = 0; index < firstHalfLength; index++) {
            firstHalf.push(index);
        }
        const secondHalf = [];
        for (let index = firstHalfLength; index < total; index++) {
            secondHalf.push(index);
        }
        return [firstHalf, secondHalf];
    }, [total]);

    useEffect(() => {
        focusNextInput();       // focus first input that can be focused
    }, []);

    const textTransform = getTextTransform(options);

    return (
        <div className="relative flex-1 bg-gray-5 dark:bg-gray-95 sm:rounded-[20px] flex flex-col items-center 
            pt-[48px] pb-[50px] px-[20px] overflow-y-auto">

            <h2 className="text-[20px] font-[500] mb-[28px] text-gray-80 dark:text-gray-10 text-center">
                {title}
            </h2>

            <div className="w-full max-w-[1000px] grid grid-cols-2 gap-[50px] max-md:flex max-md:gap-[10px]
                max-md:flex-col">
                <div className="flex flex-col gap-[10px]">
                    {firstHalf.map((index) =>
                        <Card
                            key={index}
                            questionIndex={index}
                            textTransform={textTransform}
                        />
                    )}
                </div>

                <div className="flex flex-col gap-[10px]">
                    {secondHalf.map((index) =>
                        <Card
                            key={index}
                            questionIndex={index}
                            textTransform={textTransform}
                        />
                    )}
                </div>
            </div>
        </div>
    );
}

function getTextTransform(options: GameOptions): "uppercase" | "capitalize" | undefined {
    if (options.guess === "capital") {
        return "capitalize";
    } else if (options.guess === "plate") {
        return "uppercase";
    }
}
