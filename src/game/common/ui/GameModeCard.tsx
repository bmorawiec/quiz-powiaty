import { getFilterString, getGameModeName, type GameOptions } from "src/gameOptions";
import { ClockIcon } from "src/ui";
import { toMinutesAndSeconds } from "src/utils/time";

export interface GameModeCardProps {
    options: GameOptions;
    time: number;
}

export function GameModeCard({ options, time }: GameModeCardProps) {
    const gameModeName = getGameModeName(options);
    const filterString = getFilterString(options.filters);

    const [minutes, seconds] = toMinutesAndSeconds(time);

    return (
        <div className="flex flex-col gap-[4px] rounded-[10px] px-[22px] pt-[18px] pb-[16px] border
            bg-white border-gray-15 dark:bg-gray-95 dark:border-gray-80">
            <p>
                {gameModeName}
            </p>
            <div className="flex gap-[4px] max-xs:flex-col justify-between">
                <p>
                    Filtry: {filterString}
                </p>

                <div className="sm:hidden flex gap-[5px] items-center">
                    <ClockIcon className="size-[14px]"/>
                    <span>
                        {minutes}:{seconds}
                    </span>
                </div>
            </div>
        </div>
    );
}
