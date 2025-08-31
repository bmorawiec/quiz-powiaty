export interface GuessDistributionRowProps {
    label: string;
    amount: number;
    max: number;
    weight: number;
}

export function GuessDistributionRow({ label, amount, max, weight }: GuessDistributionRowProps) {
    const percent = amount / max * 100;

    return (
        <div className="flex gap-[10px] items-center">
            <p className="w-[160px]">
                {label}
            </p>
            <p className="w-[30px] text-right font-[550]">
                {amount}
            </p>
            <p className="w-[50px]">
                x{weight}pkt
            </p>
            <div className="flex-1">
                <div
                    style={{
                        width: percent + "%",
                    }}
                    className="bg-teal-70 rounded-[10px] h-[10px]"
                />
            </div>
        </div>
    );
}
