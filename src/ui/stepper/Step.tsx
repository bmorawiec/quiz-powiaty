import clsx from "clsx";
import type { ComponentType } from "react";
import type { IconProps } from "../icons";

export interface StepProps {
    icon?: ComponentType<IconProps>;
    number?: number;
    selected?: boolean;
    onClick?: () => void;
}

export function Step({ icon, number, selected, onClick }: StepProps) {
    const mode = (icon)
            ? (number === undefined)
                ? "alwaysDown"
                : (selected) ? "alwaysUp" : "animated"
            : "alwaysUp";

    const Icon = icon;
    return (
        <button
            className={clsx("h-[50px] flex-1 flex items-center group rounded-[10px] focus-ring",
                "transition-colors duration-40",
                onClick && "cursor-pointer hover:bg-black/4 active:bg-black/6")}
            onClick={onClick}
        >
            <div className="flex-1 h-[2px] group-not-first:bg-black/15"/>
            <div className={clsx("mx-[2px] size-[30px] rounded-[10px] overflow-clip text-[14px] font-[450]",
                (selected) ? "bg-teal-70 text-white" : "bg-black/10 text-gray-70")}>
                <div className={clsx("transition-transform duration-100", 
                    (mode === "alwaysUp")
                        ? "translate-y-[-30px]"
                        : mode === "animated" && "group-hover:translate-y-[-30px] "
                            + "group-focus-visible:translate-y-[-30px]")}>
                    <div className="size-[30px] flex items-center justify-center">
                        {Icon && <Icon className="size-[14px]"/>}
                    </div>
                    <div className="size-[30px] flex items-center justify-center">
                        {number}
                    </div>
                </div>
            </div>
            <div className="flex-1 h-[2px] group-not-last:bg-black/15"/>
        </button>
    );
}
