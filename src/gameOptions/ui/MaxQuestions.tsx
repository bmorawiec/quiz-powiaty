import clsx from "clsx";
import { useEffect, useState } from "react";
import { Slider } from "src/ui";

export interface MaxQuestionsProps {
    value: number | null;
    onChange: (newValue: number | null) => void;
    className?: string;
}

export function MaxQuestions({ value, onChange, className }: MaxQuestionsProps) {
    const [newValue, setNewValue] = useState(value);

    useEffect(() => {
        setNewValue(value);
    }, [value]);

    const handleSliderDragEnd = () => {
        onChange(newValue);
    };

    const sliderValue = newValue || 60;
    const handleSliderChange = (newValue: number) => {
        if (newValue >= 60) {
            setNewValue(null);
        } else {
            setNewValue(newValue);
        }
    };

    return (
        <div className={clsx("flex flex-col", className)}>
            <span className="text-[14px] text-gray-60 dark:text-gray-50 font-[500]">
                Ilość pytań
            </span>

            <div className="flex items-center">
                <Slider
                    min={10}
                    max={60}
                    step={10}
                    value={sliderValue}
                    onChange={handleSliderChange}
                    onDragEnd={handleSliderDragEnd}
                    className="flex-1"
                />

                <p className="w-[35px] text-right">
                    {newValue || "\u221e"}
                </p>
            </div>
        </div>
    );
}
