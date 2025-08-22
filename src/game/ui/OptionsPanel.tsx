import clsx from "clsx";
import { useState } from "react";
import { DropdownIcon, Filters } from "src/ui";
import type { GameOptions, UnitFilters } from "../common";

export interface OptionsPanelProps {
    options: GameOptions;
    onChange: (newOptions: GameOptions) => void;
}

export function OptionsPanel({ options, onChange }: OptionsPanelProps) {
    const [expanded, setExpanded] = useState(true);

    const handleHeaderClick = () => {
        setExpanded(!expanded);
    };

    const handleFiltersChange = (newFilters: UnitFilters) => {
        onChange({
            ...options,
            filters: newFilters,
        });
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
                <Filters
                    filters={options.filters}
                    onChange={handleFiltersChange}
                />
            )}
        </div>
    );
}
