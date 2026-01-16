import { useMemo } from "react";
import { getFilterString, type GameOptions } from "src/gameOptions";
import { Button, FilterIcon } from "src/ui";

export interface FilterSectionProps {
    options: GameOptions;
    onExpand: () => void;
}

export function FilterSection({ options, onExpand }: FilterSectionProps) {
    const filterString = useMemo(() => getFilterString(options.filters), [options.filters]);
    return (
        <div className="flex flex-col mt-[14px]">
            <div className="flex items-end gap-[20px]">
                <div className="flex-1 flex flex-col text-left min-w-0">
                    <span className="text-[14px] text-gray-60 dark:text-gray-50 font-[500]">Filtrowanie</span>
                    <span className="font-[450] truncate">
                        {filterString}
                    </span>
                </div>

                <Button
                    icon={FilterIcon}
                    text="Zmień filtr"
                    onClick={onExpand}
                />
            </div>
        </div>
    );
}
