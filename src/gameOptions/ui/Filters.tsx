import clsx from "clsx";
import { useMemo } from "react";
import { Button, FilterIcon } from "src/ui";
import { getFilterString, type UnitFilters } from "../filters";

export interface FiltersProps {
    filters: UnitFilters;
    onExpand?: () => void;
    className: string;
}

export function Filters({ filters, onExpand, className }: FiltersProps) {
    const filterString = useMemo(
        () => getFilterString(filters),
        [filters]
    );

    return (
        <div className={clsx("flex flex-col", className)}>
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
