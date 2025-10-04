import { getFilterString, getGameModeName, type GameOptions } from "src/gameOptions";

export interface GameModeCardProps {
    options: GameOptions;
}

export function GameModeCard({ options }: GameModeCardProps) {
    const gameModeName = getGameModeName(options);
    const filterString = getFilterString(options.filters);

    return (
        <div className="flex flex-col gap-[4px] rounded-[10px] px-[22px] pt-[18px] pb-[16px] border
            bg-white border-gray-15 dark:bg-gray-95 dark:border-gray-80">
            <p>
                {gameModeName}
            </p>
            <p>
                Filtry: {filterString}
            </p>
        </div>
    );
}
