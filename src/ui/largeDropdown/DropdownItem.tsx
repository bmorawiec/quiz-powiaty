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
            className={clsx("flex items-center cursor-pointer p-[10px] hover:bg-gray-5 dark:hover:bg-gray-85",
                "rounded-[6px] transition-colors duration-80",
                selected && "bg-gray-5 hover:bg-gray-10 dark:bg-gray-85 hover:dark:bg-gray-80")}
            onClick={handleClick}
        >
            {Icon && (
                <div className="flex items-center justify-center bg-gray-15 dark:bg-gray-80 size-[30px] rounded-[6px]
                    text-gray-100 dark:text-gray-10 mr-[6px]">
                    <Icon/>
                </div>
            )}
            <span className="ml-[4px] flex-1 text-left text-[16px] font-[450] dark:text-gray-5 overflow-hidden truncate">
                {label}
            </span>
        </button>
    );
}
