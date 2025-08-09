import type { UnitTag } from "src/data";
import type { UnitFilterMode } from "src/game/common";
import { FilterInputButton } from "./FilterInputButton";

export interface FilterInputProps {
    tag: UnitTag;
    label: string;
    mode: UnitFilterMode | undefined;
    onChange: (tag: UnitTag, oldMode: UnitFilterMode | undefined, newMode: UnitFilterMode | undefined) => void;
}

export function FilterInput({ tag, label, mode, onChange }: FilterInputProps) {
    const emitIfChanged = (newMode: UnitFilterMode | undefined) => {
        if (newMode !== mode) {
            onChange(tag, mode, newMode);
        }
    };

    const handleExcludeClick = () => {
        emitIfChanged("exclude");
    };

    const handleNeutralClick = () => {
        emitIfChanged(undefined);
    };

    const handleIncludeClick = () => {
        emitIfChanged("include");
    };

    return (
        <div className="flex items-center">
            <span className="flex-1 text-[14px] font-[450] text-gray-80 dark:text-gray-20 tracking-[0.01em]">
                {label}
            </span>

            <div className="flex rounded-[10px] border border-gray-20 dark:border-gray-75">
                <FilterInputButton
                    mode="exclude"
                    active={mode === "exclude"}
                    onClick={handleExcludeClick}
                />
                <FilterInputButton
                    mode={undefined}
                    active={mode === undefined}
                    onClick={handleNeutralClick}
                />
                <FilterInputButton
                    mode="include"
                    active={mode === "include"}
                    onClick={handleIncludeClick}
                />
            </div>
        </div>
    )
}
