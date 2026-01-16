import { useEffect, useMemo, useState } from "react";
import type { GameOptions } from "src/gameOptions";
import { Slider } from "src/ui";

export interface MaxQuestionsProps {
    options: GameOptions;
    onChange: (newOptions: GameOptions) => void;
}

const sliderValueMap = [5, 10, 15, 20, 30, 40, 50, null];

export function MaxQuestions({ options, onChange }: MaxQuestionsProps) {
    const [newValue, setNewValue] = useState(options.maxQuestions);
    const sliderValue = useMemo(() => sliderValueMap.indexOf(newValue), [newValue]);
    useEffect(() => {
        setNewValue(options.maxQuestions);
    }, [options.maxQuestions]);

    const handleSliderDragEnd = () => {
        onChange({
            ...options,
            maxQuestions: newValue,
        });
    };

    const handleSliderChange = (newSliderValue: number) => {
        const newValue = sliderValueMap[newSliderValue];
        setNewValue(newValue);
    };

    return (
        <div className="flex flex-col mt-[12px]">
            <span className="text-[14px] text-gray-60 dark:text-gray-50 font-[500]">
                Ilość pytań
            </span>

            <div className="flex items-center">
                <Slider
                    min={0}
                    max={sliderValueMap.length - 1}
                    step={1}
                    value={sliderValue}
                    onChange={handleSliderChange}
                    onDragEnd={handleSliderDragEnd}
                    className="flex-1"
                />

                <p className="w-[35px] text-right">
                    {newValue || (
                        <span className="mr-[-3px] text-[12px] font-[450]">
                            MAX
                        </span>
                    )}
                </p>
            </div>
        </div>
    );
}
