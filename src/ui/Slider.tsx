import clsx from "clsx";
import { useCallback, useEffect, useMemo, useRef, useState, type PointerEvent as ReactPointerEvent } from "react";

export interface SliderProps {
    min: number;
    max: number;
    step?: number;
    value: number;
    onChange: (newValue: number) => void;
    onDragEnd?: () => void;
    className?: string;
}

export function Slider({ min, max, step = 1, value, onChange, onDragEnd, className }: SliderProps) {
    let normValue = value;
    if (normValue < min) {
        normValue = min;
    } else if (normValue > max) {
        normValue = max;
    }

    const container = useRef<HTMLDivElement | null>(null);

    const [dragging, setDragging] = useState(false);

    const updateValue = useCallback((clientX: number) => {
        const containerRect = container.current!.getBoundingClientRect();
        const fraction = (clientX - containerRect.left) / containerRect.width;
        let newValue = min + Math.round(fraction * (max - min) / step) * step;
        if (newValue < min) {
            newValue = min;
        } else if (newValue > max) {
            newValue = max;
        }
        onChange(newValue);
    }, [min, max, step, onChange]);

    useEffect(() => {
        if (dragging) {
            const handleDocumentPointerMove = (event: PointerEvent) => {
                updateValue(event.clientX);
            };

            const handleDocumentPointerUp = () => {
                setDragging(false);
                onDragEnd?.();
            };

            document.addEventListener("pointermove", handleDocumentPointerMove);
            document.addEventListener("pointerup", handleDocumentPointerUp);
            return () => {
                document.removeEventListener("pointermove", handleDocumentPointerMove);
                document.removeEventListener("pointerup", handleDocumentPointerUp);
            };
        }
    }, [dragging, updateValue, onDragEnd]);

    const handlePointerDown = (event: ReactPointerEvent) => {
        updateValue(event.clientX);
        setDragging(true);
    };

    const valuePercent = (normValue - min) / (max - min) * 100;

    const steps = useMemo(() => {
        const steps: number[] = [];
        const stepPercent = 100 / ((max - min) / step);
        for (let percent = stepPercent; percent < 100; percent += stepPercent) {
            steps.push(percent);
        }
        return steps;
    }, [min, max, step]);

    return (
        <div
            ref={container}
            className={clsx("flex items-center h-[30px] group", className)}
            onPointerDown={handlePointerDown}
        >
            <div className="relative flex-1 bg-gray-20 h-[6px] rounded-full">
                <div
                    className="h-[6px] rounded-full transition-all duration-80 bg-teal-70 group-hover:bg-teal-75"
                    style={{
                        width: valuePercent + "%",
                    }}
                />

                {steps.map((percent, index) =>
                    <div
                        key={index}
                        className={clsx("absolute size-[4px] ml-[-2px] top-[1px] rounded-full",
                            (percent < valuePercent) ? "bg-white" : "bg-teal-70")}
                        style={{
                            left: percent + "%",
                        }}
                    />
                )}

                <div
                    className={clsx("absolute rounded-full",
                        "transition-all duration-80 bg-teal-70 group-hover:bg-teal-75",
                        (dragging) ? "size-[20px] ml-[-10px] top-[-7px]" : "size-[16px] ml-[-8px] top-[-5px]")}
                    style={{
                        left: valuePercent + "%",
                    }}
                />
            </div>
        </div>
    );
}
