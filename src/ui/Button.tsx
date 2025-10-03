import type { ComponentType } from "react";
import type { IconProps } from "./icons";
import clsx from "clsx";

export interface ButtonProps {
    icon?: ComponentType<IconProps>;
    text: string;
    filled?: boolean;
    onClick?: () => void;
    className?: string;
}

export function Button({ icon: Icon, text, filled, onClick, className }: ButtonProps) {
    return (
        <button
            className={clsx("h-[34px] flex items-center cursor-pointer px-[18px] text-[14px] font-[500] rounded-full",
                "transition-colors duration-80 focus-ring",
                (filled)
                    ? "bg-teal-70 text-white hover:bg-teal-65 active:bg-teal-75 " +
                        "dark:bg-teal-75 dark:hover:bg-teal-70 dark:active:bg-teal-65"
                    : "border text-teal-80 hover:bg-gray-10 active:bg-gray-15 " +
                        "dark:text-teal-55 dark:hover:bg-gray-90 dark:active:bg-gray-85",
                className)}
            onClick={onClick}
        >
            {Icon && (
                <Icon className="size-[14px] mr-[6px]"/>
            )}
            <span>{text}</span>
        </button>
    );
}
