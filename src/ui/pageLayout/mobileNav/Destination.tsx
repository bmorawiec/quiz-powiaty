import clsx from "clsx";
import { NavLink } from "react-router";

export interface DestinationProps {
    label: string;
    where: string;
    className?: string;
}

export function Destination({ label, where, className }: DestinationProps) {
    return (
        <NavLink
            to={where}
            role="navigation"
            className={clsx("shrink-0 flex items-center px-[25px] h-[70px] text-[24px] rounded-full",
                "transition-colors duration-80 text-gray-100 dark:text-gray-10",
                "hover:bg-gray-10 dark:hover:bg-gray-80", className)}
        >
            {label}
        </NavLink>
    );
}
