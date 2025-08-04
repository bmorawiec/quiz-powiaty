import { NavLink } from "react-router";
import { DropdownIcon } from "../../icons";
import { useEffect, useRef, useState, type ReactNode } from "react";
import clsx from "clsx";

export interface DropdownDestinationProps {
    label: string;
    where: string;
    className?: string;
    children?: ReactNode;
}

export function DropdownDestination({ label, where, className, children }: DropdownDestinationProps) {
    const [dropdownState, setDropdownState] = useState<"animIn" | "animOut" | "hidden">("hidden");

    const animOutTimeout = useRef<number | null>(null);
    useEffect(() => {
        return () => {  // clear animation timeout if component unmounts before the fade out animation finishes.
            if (animOutTimeout.current) clearTimeout(animOutTimeout.current);
        };
    }, []);

    const handleMouseOver = () => {
        if (animOutTimeout.current) {
            // clear animation timeout if user hovered on the element before fade out animation finished.
            clearTimeout(animOutTimeout.current);
        }
        setDropdownState("animIn");
    };

    const handleMouseLeave = () => {
        setDropdownState("animOut");
        animOutTimeout.current = setTimeout(
            () => setDropdownState("hidden"),
            100,
        );
    };

    return (
        <div
            className={clsx("group", className)}
            onMouseOver={handleMouseOver}
            onMouseLeave={handleMouseLeave}
        >
            <NavLink
                to={where}
                className="flex items-center gap-[6px] px-[25px] h-[50px] text-[18px] font-[450] rounded-full 
                    transition-colors duration-80 text-gray-100 dark:text-gray-10
                    hover:bg-gray-10 group-hover:bg-gray-5 dark:hover:bg-gray-85 dark:group-hover:bg-gray-90"
            >
                <span>{label}</span>
                <DropdownIcon className="transition-transform duration-200 group-hover:rotate-180"/>
            </NavLink>

            {dropdownState !== "hidden" && (
                <div 
                    className={clsx("absolute left-[160px] top-[70px] pt-[10px]",
                        (dropdownState === "animIn") ? "animate-fade-in" : "animate-fade-out pointer-events-none")}
                >
                    <div className="w-[820px] bg-white dark:bg-gray-90 shadow-sm shadow-black/10 rounded-[20px]
                        grid grid-cols-3 p-[15px]">
                        {children}
                    </div>
                </div>
            )}
        </div>
    );
}

