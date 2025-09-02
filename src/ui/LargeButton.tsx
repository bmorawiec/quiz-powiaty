import clsx from "clsx";
import type { ComponentType } from "react";

export interface LargeButton {
    short?: boolean;
    primary?: boolean;
    error?: boolean;
    text: string;
    icon?: ComponentType;
    iconRight?: ComponentType;
    className?: string;
    onClick?: () => void;
}

export function LargeButton({
    short,
    primary,
    error,
    text,
    icon: Icon,
    iconRight: IconRight,
    className,
    onClick,
}: LargeButton) {
    return (
        <button
            className={clsx("flex items-center justify-center gap-[6px] h-[60px] rounded-[10px]",
                "cursor-pointer text-[18px] transition-colors duration-100 focus-ring px-[40px]",
                (short) ? "h-[50px]" : "h-[60px]",
                (error)
                    ? "font-[450] bg-red-65 hover:bg-red-75 text-white dark:bg-red-70 dark:text-gray-5 " +
                        "dark:hover:bg-red-75"
                    : (primary)
                        ? "font-[450] bg-teal-70 hover:bg-teal-65 text-white dark:bg-teal-80 hover:dark:bg-teal-85"
                        : "bg-gray-10 hover:bg-gray-15 text-black-100 dark:bg-gray-90 dark:hover:bg-gray-95",
                className)}
            onClick={onClick}
        >
            {Icon && (
                <Icon/>
            )}

            <span>
                {text}
            </span>

            {IconRight && (
                <IconRight/>
            )}
        </button>
    );
}
