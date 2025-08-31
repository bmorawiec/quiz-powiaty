export interface ProgressBarProps {
    percent: number;
    points: number;
    maxPoints: number;
}

export function ProgressBar({ percent, points, maxPoints }: ProgressBarProps) {
    return (
        <div className="flex flex-col gap-[8px]">
            <div className="h-[25px] bg-white dark:bg-gray-90 rounded-[10px] overflow-hidden">
                <div
                    style={{
                        width: percent + "%",
                    }}
                    className="bg-teal-70 dark:bg-teal-80 h-full"
                />
            </div>

            <p className="self-end text-[20px] text-teal-75 dark:text-teal-70">
                {percent}% ({points}/{maxPoints} punktów)
            </p>
        </div>
    );
}
