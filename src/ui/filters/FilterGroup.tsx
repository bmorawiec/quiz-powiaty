import { Checkbox } from "../Checkbox";

export interface FilterGroupProps<TEntry extends string> {
    title: string;
    entries: readonly TEntry[];
    checked: readonly TEntry[];
    labels: Record<TEntry, string>;
    onChange: (newFilters: TEntry[]) => void;
}

export function FilterGroup<TEntry extends string>({
    title,
    entries,
    checked,
    labels,
    onChange,
}: FilterGroupProps<TEntry>) {
    const handleCheckboxChange = (newValue: boolean, entry: TEntry) => {
        const index = checked.indexOf(entry);
        if (index === -1) {
            if (newValue) {
                onChange([...checked, entry]);
            }
        } else if (!newValue) {
            onChange(checked.filter((ent) => ent !== entry));
        }
    };

    return (
        <div className="flex flex-col mb-[8px]">
            <h3 className="text-[14px] font-[500] pb-[4px] mt-[8px] mb-[4px] border-b text-gray-60 border-gray-30
                dark:text-gray-55 dark:border-gray-70">
                {title}
            </h3>

            <div className="flex flex-col pl-[4px]">
                {entries.map((entry) =>
                    <Checkbox
                        key={entry}
                        checked={checked.includes(entry)}
                        label={labels[entry]}
                        onChange={(newValue) => handleCheckboxChange(newValue, entry)}
                    />
                )}
            </div>
        </div>
    );
}
