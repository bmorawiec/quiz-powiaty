import { useState } from "react";
import { voivodeshipIds, type CountyType, type VoivodeshipId } from "src/data/common";
import { ApplyIcon, Button, CloseIcon, Dialog, DialogRoot, FilterIcon } from "src/ui";
import { filterNames } from "../../filterNames";
import { type UnitFilters } from "../../types";
import { FilterGroup } from "./FilterGroup";

export interface FilterDialogProps {
    filters: UnitFilters;
    onApply?: (newFilters: UnitFilters) => void;
    onCancel?: () => void;
}

export function FilterDialog({ filters, onApply, onCancel }: FilterDialogProps) {
    const [newFilters, setNewFilters] = useState(filters);

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
        onApply?.(newFilters);
    };

    return (
        <DialogRoot onScrimPointerDown={onCancel}>
            <Dialog className="w-[450px] h-[650px]">
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
                        onClick={onCancel}
                    />
                    <Button
                        icon={ApplyIcon}
                        text="Zastosuj"
                        filled
                        onClick={handleApplyClick}
                    />
                </div>
            </Dialog>
        </DialogRoot>
    );
}
