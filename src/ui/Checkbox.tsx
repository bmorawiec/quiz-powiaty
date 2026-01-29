import clsx from "clsx";
import { ApplyIcon } from "./icons";

export interface CheckboxProps {
    checked: boolean;
    label: string;
    onChange: (newValue: boolean) => void;
}

export function Checkbox({ checked, label, onChange }: CheckboxProps) {
    const handleClick = () => {
        onChange(!checked);
    };

    return (
        <button
            onClick={handleClick}
            className="h-[34px] flex items-center gap-[5px] group rounded-[1px] focus-ring"
        >
            <div className={clsx("size-[16px] rounded-[4px] flex items-center justify-center",
                (checked)
                    ? "bg-teal-70 group-hover:bg-teal-65 group-active:bg-teal-75 " +
                        "bg-teal-75 dark:group-hover:bg-teal-70 dark:group-active:bg-teal-65"
                    : "border border-gray-80 group-hover:bg-black/8 group-active:bg-black/12 " +
                        "dark:group-hover:bg-white/8 dark:group-active:bg-white/12")}>
                {checked && <ApplyIcon className="size-[10px] text-white"/>}
            </div>
            <span>
                {label}
            </span>
        </button>
    );
}
