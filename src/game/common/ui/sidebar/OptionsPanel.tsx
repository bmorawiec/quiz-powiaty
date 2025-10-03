import clsx from "clsx";
import { useState, type ReactNode } from "react";
import { DropdownIcon } from "src/ui";

export interface OptionsPanelProps {
    children?: ReactNode;
}

export function OptionsPanel({ children }: OptionsPanelProps) {
    const [expanded, setExpanded] = useState(true);

    const handleHeaderClick = () => {
        setExpanded(!expanded);
    };

    return (
        <div className="flex flex-col border-t border-gray-15 dark:border-gray-80">
            <button
                className="m-[10px] h-[60px] flex items-center justify-between px-[20px] cursor-pointer
                    rounded-[10px] transition-colors duration-80 focus-ring
                    hover:bg-gray-5 active:bg-gray-10 dark:hover:bg-gray-90 dark:active:bg-gray-85"
                onClick={handleHeaderClick}
            >
                <span className="text-gray-80 dark:text-gray-15 font-[550]">
                    Opcje rozgrywki
                </span>

                <DropdownIcon className={clsx("transition-transform duration-100", !expanded && "rotate-180")}/>
            </button>

            {expanded && (
                <div className="flex flex-col pb-[26px]">
                    {children}
                </div>
            )}
        </div>
    );
}
