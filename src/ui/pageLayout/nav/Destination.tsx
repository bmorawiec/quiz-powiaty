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
            className={clsx("flex items-center px-[25px] h-[50px] text-[18px] font-[450] rounded-full",
                "transition-colors duration-80 text-gray-100 dark:text-gray-10",
                "hover:bg-gray-10 dark:hover:bg-gray-90", className)}
        >
            {label}
        </NavLink>
    );
}
