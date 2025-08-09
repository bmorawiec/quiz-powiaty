import type { UnitTag } from "src/data";
import { type UnitFilter, type UnitFilterMode } from "src/game/common";
import { FilterInput } from "./FilterInput";

export interface FilterGroupProps {
    title: string;
    tags: UnitTag[];
    filters: UnitFilter[];
    onChange: (newFilters: UnitFilter[]) => void;
}

export function FilterGroup({ title, tags, filters, onChange }: FilterGroupProps) {
    const handleFilterChange = (
        tag: UnitTag,
        oldMode: UnitFilterMode | undefined,
        newMode: UnitFilterMode | undefined,
    ) => {
        let newFilters: UnitFilter[];
        if (newMode === undefined) {
            newFilters = filters.filter((filter) => filter.tag !== tag);   // remove filter
        } else {
            const newFilter: UnitFilter = { tag, mode: newMode };
            if (oldMode === undefined) {
                newFilters = [...filters, newFilter];   // add filter to array if it isn't in it
            } else {
                // swap filter out if it already is in the array
                newFilters = filters.map((filter) => (filter.tag === tag) ? newFilter : filter);
            }
        }

        onChange(newFilters);
    };

    return (
        <div className="flex flex-col mb-[8px]">
            <h3 className="text-[14px] font-[500] pb-[4px] my-[8px] border-b text-gray-60 border-gray-30
                dark:text-gray-55 dark:border-gray-70">
                {title}
            </h3>

            <div className="flex flex-col pl-[5px] gap-[10px]">
                {tags.map((tag) => {
                    const filter = filters.find((filter) => filter.tag === tag);
                    return (
                        <FilterInput
                            key={tag}
                            tag={tag as UnitTag}
                            mode={filter?.mode}
                            onChange={handleFilterChange}
                        />
                    );
                })}
            </div>
        </div>
    );
}
