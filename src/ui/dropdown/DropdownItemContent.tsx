import clsx from "clsx";
import type { DropdownItemContent } from "./state";

export interface DropdownItemContentViewProps {
    content: DropdownItemContent;
    className?: string;
}

export function DropdownItemContentView({ content, className }: DropdownItemContentViewProps) {
    const Icon = content.icon;
    return (
        <div className={clsx("min-w-0 flex items-center px-[7px]", className)}>
            {Icon && (
                <div className="flex items-center justify-center bg-black/10 dark:bg-white/16 size-[24px]
                    rounded-[6px] mr-[2px]">
                    <Icon className="size-[12px]"/>
                </div>
            )}
            <span className="ml-[4px] flex-1 text-left text-[14px] dark:text-gray-5 overflow-hidden truncate">
                {content.label}
            </span>
        </div>
    );
}
