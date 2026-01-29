import clsx from "clsx";
import type { ComponentType } from "react";
import type { IconProps } from "../icons";

export interface DropdownItemProps<TValue extends string> {
    value: TValue;
    icon?: ComponentType<IconProps>;
    label: string;
    selected: boolean;
    onClick: (value: TValue) => void;
}

export function DropdownItem<TValue extends string>({
    value,
    icon: Icon,
    label,
    selected,
    onClick,
}: DropdownItemProps<TValue>) {
    const handleClick = () => {
        onClick(value);
    };

    return (
        <button
            role="option"
            aria-selected={selected}
            className={clsx("flex items-center cursor-pointer p-[8px]",
                "rounded-[6px] transition-colors duration-80 focus-ring",
                (selected)
                    ? "bg-black/5 hover:bg-black/8 dark:bg-white/5 hover:dark:bg-white/8"
                    : "hover:bg-black/5 dark:hover:bg-white/5")}
            onClick={handleClick}
        >
            {Icon && (
                <div className="flex items-center justify-center bg-black/10 dark:bg-white/16 size-[26px]
                    rounded-[6px] mr-[6px]">
                    <Icon className="size-[14px]"/>
                </div>
            )}
            <span className="ml-[4px] flex-1 text-left text-[16px] dark:text-gray-5 overflow-hidden truncate">
                {label}
            </span>
        </button>
    );
}
