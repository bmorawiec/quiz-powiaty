import clsx from "clsx";
import { useState } from "react";
import { Button, DropdownIcon, FilterDialog, FilterIcon } from "src/ui";
import type { GameOptions, UnitFilter } from "../common";

export interface OptionsPanelProps {
    options: GameOptions;
    onChange: (newOptions: GameOptions) => void;
}

export function OptionsPanel({ options, onChange }: OptionsPanelProps) {
    const [expanded, setExpanded] = useState(true);

    const handleHeaderClick = () => {
        setExpanded(!expanded);
    };

    const [showFilterDialog, setShowFilterDialog] = useState(false);

    const handleFilterButtonClick = () => {
        setShowFilterDialog(true);
    };

    const handleApplyFilters = (newFilters: UnitFilter[]) => {
        onChange({
            ...options,
            filters: newFilters,
        });
    };

    const handleCloseFilterDialog = () => {
        setShowFilterDialog(false);
    };

    return (
        <div className="flex flex-col border-t border-gray-15 dark:border-gray-80 mt-auto pb-[5px]">
            <button
                className="m-[10px] mb-[5px] h-[60px] flex items-center justify-between px-[20px] cursor-pointer
                    rounded-[10px] transition-colors duration-80 focus-ring
                    hover:bg-gray-5 active:bg-gray-10 dark:hover:bg-gray-90 dark:active:bg-gray-85"
                onClick={handleHeaderClick}
            >
                <span className="text-gray-80 dark:text-gray-15 font-[550]">
                    Opcje rozgrywki
                </span>

                <DropdownIcon className={clsx("transition-transform duration-100", !expanded && "rotate-180")}/>
            </button>

            {expanded && (
                <div className="flex flex-col px-[30px] pb-[25px]">
                    <div className="flex items-end">
                        <div className="flex-1 flex flex-col text-left">
                            <span className="text-[14px] text-gray-60 dark:text-gray-50 font-[500]">Filtrowanie</span>
                            <span className="font-[450]">Nie ustawiono</span>
                        </div>

                        <Button
                            icon={FilterIcon}
                            text="Zmień filtr"
                            onClick={handleFilterButtonClick}
                        />
                    </div>
                </div>
            )}

            {showFilterDialog && (
                <FilterDialog
                    filters={options.filters}
                    onApply={handleApplyFilters}
                    onClose={handleCloseFilterDialog}
                />
            )}
        </div>
    );
}
