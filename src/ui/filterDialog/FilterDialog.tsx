import { useState, type PointerEvent as ReactPointerEvent } from "react";
import type { UnitTag } from "src/data";
import type { UnitFilter } from "src/game/common";
import { Button } from "../Button";
import { ApplyIcon, CloseIcon, FilterIcon } from "../icons";
import { FilterGroup } from "./FilterGroup";

export interface FilterDialogProps {
    filters: UnitFilter[];
    onApply: (newFilters: UnitFilter[]) => void;
    onClose: () => void;
}

const statusFilterLabels = {
    "city": "miasto na prawach powiatu",
} as const satisfies Partial<Record<UnitTag, string>>;

const voivodeshipFilterLabels = {
    "voiv-DS": "województwo dolnośląskie",
    "voiv-KP": "województwo kujawsko-pomorskie",
    "voiv-LU": "województwo lubelskie",
    "voiv-LB": "województwo lubuskie",
    "voiv-LD": "województwo łódzkie",
    "voiv-MA": "województwo małopolskie",
    "voiv-MZ": "województwo mazowieckie",
    "voiv-OP": "województwo opolskie",
    "voiv-PK": "województwo podkarpackie",
    "voiv-PD": "województwo podlaskie",
    "voiv-PM": "województwo pomorskie",
    "voiv-SL": "województwo śląskie",
    "voiv-SK": "województwo świętokrzyskie",
    "voiv-WN": "województwo warmińsko-mazurskie",
    "voiv-WP": "województwo wielkopolskie",
    "voiv-ZP": "województwo zachodniopomorskie",
} as const satisfies Partial<Record<UnitTag, string>>;

export function FilterDialog({ filters, onApply, onClose }: FilterDialogProps) {
    const [newFilters, setNewFilters] = useState(filters);

    const handleScrimPointerDown = (event: ReactPointerEvent) => {
        if (event.target === event.currentTarget) {
            onClose();
        }
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
                        title="Według statusu"
                        labels={statusFilterLabels}
                        filters={newFilters}
                        onChange={setNewFilters}
                    />

                    <FilterGroup
                        title="Według województwa"
                        labels={voivodeshipFilterLabels}
                        filters={newFilters}
                        onChange={setNewFilters}
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
