import type { ComponentType, ReactNode } from "react";
import { NavLink } from "react-router";
import type { IconProps } from "../../icons";
import clsx from "clsx";

export interface DropdownTileProps {
    icon: ComponentType<IconProps>;
    title: string;
    where: string;
    className?: string;
    children?: ReactNode;
}

export function DropdownTile({ icon: Icon, title, where, className, children }: DropdownTileProps) {
    return (
        <NavLink
            to={where}
            className={clsx("relative flex flex-col p-[15px] pl-[55px] gap-[3px] transition-colors duration-[80ms]",
                "hover:bg-gray-5 dark:hover:bg-gray-85 rounded-[15px] focus-ring", className)}
        >
            <div className="absolute left-[15px] top-[15px] flex items-center justify-center
                bg-gray-15 dark:bg-gray-80 size-[30px] rounded-[6px]">
                <Icon className="dark:text-gray-20"/>
            </div>
            <h2 className="text-[16px] font-[450] text-gray-85 dark:text-gray-15">
                {title}
            </h2>
            <div className="flex flex-col text-gray-65 dark:text-gray-40 text-[14px] gap-[3px]">
                {children}
            </div>
        </NavLink>
    );
}
