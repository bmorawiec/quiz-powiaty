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
            className={clsx("relative flex flex-col p-[15px] pl-[60px] gap-[3px] transition-colors duration-[80ms]",
                "hover:bg-gray-5 dark:hover:bg-gray-85 rounded-[15px]", className)}
        >
            <div className="absolute left-[20px] top-[20px] flex items-center justify-center
                bg-gray-15 dark:bg-gray-80 size-[30px] rounded-[6px]">
                <Icon className="text-gray-100 dark:text-gray-20"/>
            </div>
            <h2 className="text-gray-100 dark:text-gray-10 text-[16px] font-[450]">
                {title}
            </h2>
            <div className="flex flex-col text-gray-65 dark:text-gray-40 text-[14px] font-[450] gap-[3px]">
                {children}
            </div>
        </NavLink>
    );
}
