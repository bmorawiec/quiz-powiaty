import { useMemo } from "react";
import { Button, FilterIcon } from "src/ui";
import { filterNames, type UnitFilters } from "../types";

export interface FiltersProps {
    filters: UnitFilters;
    onExpand?: () => void;
}

export function Filters({ filters, onExpand }: FiltersProps) {
    const filterText = useMemo(() => {
        if (filters.countyTypes.length === 0 && filters.voivodeships.length === 0) {
            return "Nie ustawiono";
        }
        return [
            ...filters.countyTypes.map((countyType) => filterNames.countyTypes[countyType]),
            ...filters.voivodeships.map((voivId) => filterNames.voivodeships[voivId]),
        ].join(", ");
    }, [filters]);

    return (
        <div className="flex flex-col px-[30px] pb-[25px]">
            <div className="flex items-end gap-[20px]">
                <div className="flex-1 flex flex-col text-left min-w-0">
                    <span className="text-[14px] text-gray-60 dark:text-gray-50 font-[500]">Filtrowanie</span>
                    <span className="font-[450] truncate">
                        {filterText}
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
