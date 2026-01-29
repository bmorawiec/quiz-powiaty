import clsx from "clsx";
import type { ComponentType } from "react";
import { NavLink } from "react-router";

export interface LargeLinkProps {
    to: string;
    short?: boolean;
    primary?: boolean;
    error?: boolean;
    text: string;
    icon?: ComponentType;
    iconRight?: ComponentType;
    className?: string;
}

export function LargeLink({
    to,
    short,
    primary,
    error,
    text,
    icon: Icon,
    iconRight: IconRight,
    className,
}: LargeLinkProps) {
    return (
        <NavLink
            to={to}
            className={clsx("flex items-center justify-center gap-[6px] rounded-[10px]",
                "cursor-pointer text-[18px] transition-colors duration-100 focus-ring px-[40px]",
                (short) ? "h-[50px]" : "h-[60px]",
                (error)
                    ? "font-[450] bg-red-60 hover:bg-red-65 active:bg-red-70 text-white "
                        + "dark:bg-red-70 dark:text-gray-5 dark:hover:bg-red-75 dark:active:bg-red-80"
                    : (primary)
                        ? "font-[450] bg-teal-70 hover:bg-teal-65 active:bg-teal-60 text-white " +
                            "dark:bg-teal-80 dark:hover:bg-teal-85 dark:active:bg-teal-90"
                        : "bg-black/9 hover:bg-black/11 active:bg-black/14 text-black-100 " +
                            "dark:bg-white/12 dark:hover:bg-white/14 dark:active:bg-white/16",
                className)}
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
        </NavLink>
    );
}
