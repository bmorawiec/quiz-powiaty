import clsx from "clsx";
import type { ComponentType } from "react";
import { NavLink } from "react-router";

export interface LargeLinkProps {
    to: string;
    short?: boolean;
    primary?: boolean;
    text: string;
    icon?: ComponentType;
    iconRight?: ComponentType;
    className?: string;
}

export function LargeLink({ to, short, primary, text, icon: Icon, iconRight: IconRight, className }: LargeLinkProps) {
    return (
        <NavLink
            className={clsx("flex items-center justify-center gap-[6px] rounded-[10px]",
                "text-[18px] transition-colors duration-100 focus-ring",
                (short) ? "h-[50px]" : "h-[60px]",
                (primary)
                    ? "font-[450] bg-teal-70 hover:bg-teal-65 text-white dark:bg-teal-80 hover:dark:bg-teal-85"
                    : "bg-gray-10 hover:bg-gray-15 text-black-100 dark:bg-gray-90 dark:hover:bg-gray-95",
                className)}
            to={to}
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
