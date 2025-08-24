import { useState, type PointerEvent as ReactPointerEvent } from "react";
import { voivodeshipIds, type CountyType, type VoivodeshipId } from "src/data/common";
import { ApplyIcon, Button, CloseIcon, FilterIcon } from "src/ui";
import { filterNames, type UnitFilters } from "../../types";
import { FilterGroup } from "./FilterGroup";

export interface FilterDialogProps {
    filters: UnitFilters;
    onApply: (newFilters: UnitFilters) => void;
    onClose: () => void;
}

export function FilterDialog({ filters, onApply, onClose }: FilterDialogProps) {
    const [newFilters, setNewFilters] = useState(filters);

    const handleScrimPointerDown = (event: ReactPointerEvent) => {
        if (event.target === event.currentTarget) {
            onClose();
        }
    };

    const handleTypeFiltersChange = (newCountyTypes: CountyType[]) => {
        setNewFilters({
            ...newFilters,
            countyTypes: newCountyTypes,
        });
    };

    const handleVoivodeshipFiltersChange = (newVoivodeships: VoivodeshipId[]) => {
        setNewFilters({
            ...newFilters,
            voivodeships: newVoivodeships,
        });
    };

    const handleApplyClick = () => {
        onApply(newFilters);
        onClose();
    };

    return (
        <div
            className="fixed left-0 top-0 size-full bg-black/20 dark:bg-black/40 flex items-center justify-center"
            onPointerDown={handleScrimPointerDown}
        >
            <div className="w-[450px] h-[650px] bg-white dark:bg-black rounded-[20px] shadow-sm shadow-black/10 flex flex-col">
                <div className="flex items-center gap-[10px] px-[30px] pt-[26px] pb-[12px]
                    text-gray-80 dark:text-gray-15">
                    <FilterIcon/>
                    <h2 className="text-[18px] font-[500]">
                        Filtrowanie
                    </h2>
                </div>

                <div className="flex-1 flex flex-col px-[30px] overflow-y-auto">
                    <FilterGroup
                        title="Według rodzaju"
                        entries={["county", "city"]}
                        labels={filterNames.countyTypes}
                        checked={newFilters.countyTypes}
                        onChange={handleTypeFiltersChange}
                    />

                    <FilterGroup
                        title="Według województwa"
                        entries={voivodeshipIds}
                        labels={filterNames.voivodeships}
                        checked={newFilters.voivodeships}
                        onChange={handleVoivodeshipFiltersChange}
                    />
                </div>

                <div className="flex justify-end gap-[10px] p-[20px] border-t border-gray-20 dark:border-gray-80">
                    <Button
                        icon={CloseIcon}
                        text="Anuluj"
                        onClick={onClose}
                    />
                    <Button
                        icon={ApplyIcon}
                        text="Zastosuj"
                        filled
                        onClick={handleApplyClick}
                    />
                </div>
            </div>
        </div>
    );
}
