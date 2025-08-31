import { GuessDistributionRow } from "./GuessDistributionRow";

export interface GuessDistributionProps {
    data: [number, number, number, number];
}

export function GuessDistribution({ data }: GuessDistributionProps) {
    const [fourthPlusTime, thirdTime, secondTime, firstTime] = data;
    const max = Math.max(...data);

    return (
        <div className="flex flex-col gap-[8px] rounded-[10px] px-[22px] pt-[18px] pb-[16px] border
            bg-white border-gray-15 dark:bg-gray-95 dark:border-gray-80">
            <h3 className="font-[550]">
                Zgadniętych...
            </h3>

            <GuessDistributionRow
                label="za pierwszym razem"
                amount={firstTime}
                max={max}
                weight={3}
            />

            <GuessDistributionRow
                label="za drugim razem"
                amount={secondTime}
                max={max}
                weight={2}
            />

            <GuessDistributionRow
                label="za trzecim razem"
                amount={thirdTime}
                max={max}
                weight={1}
            />

            <GuessDistributionRow
                label="za czwartym+ razem"
                amount={fourthPlusTime}
                max={max}
                weight={0}
            />
        </div>
    );
}
