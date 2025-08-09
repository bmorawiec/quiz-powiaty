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
            className={clsx("flex items-center px-[25px] h-[50px] text-[18px] rounded-full",
                "text-gray-85 dark:text-gray-15 font-[450] transition-colors duration-80 focus-ring",
                "hover:bg-gray-10 dark:hover:bg-gray-90", className)}
        >
            {label}
        </NavLink>
    );
}
