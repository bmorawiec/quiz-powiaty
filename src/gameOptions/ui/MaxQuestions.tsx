import clsx from "clsx";
import { useEffect, useState } from "react";
import { Slider } from "src/ui";

export interface MaxQuestionsProps {
    value: number | null;
    onChange: (newValue: number | null) => void;
    className?: string;
}

const sliderValueMap = [10, 15, 20, 30, 40, 50, null];

/** Maximum question amount slider. */
export function MaxQuestions({ value, onChange, className }: MaxQuestionsProps) {
    const [newValue, setNewValue] = useState(value);

    useEffect(() => {
        setNewValue(value);
    }, [value]);

    const handleSliderDragEnd = () => {
        onChange(newValue);
    };

    const sliderValue = sliderValueMap.indexOf(newValue);
    const handleSliderChange = (newSliderValue: number) => {
        const newValue = sliderValueMap[newSliderValue];
        setNewValue(newValue);
    };

    return (
        <div className={clsx("flex flex-col", className)}>
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
