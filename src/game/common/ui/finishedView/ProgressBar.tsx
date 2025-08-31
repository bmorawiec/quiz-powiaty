export interface ProgressBarProps {
    percent: number;
    points: number;
    maxPoints: number;
}

export function ProgressBar({ percent, points, maxPoints }: ProgressBarProps) {
    return (
        <div className="flex flex-col gap-[8px]">
            <div className="h-[25px] bg-white rounded-[10px] overflow-hidden">
                <div
                    style={{
                        width: percent + "%",
                    }}
                    className="bg-teal-70 h-full"
                />
            </div>

            <p className="self-end text-[20px] text-teal-75">
                {percent}% ({points}/{maxPoints} punktów)
            </p>
        </div>
    );
}
