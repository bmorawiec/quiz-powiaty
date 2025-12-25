import clsx from "clsx";
import { FlagIcon } from "../icons";

export interface StepProps {
    number?: number;
    last?: boolean;
    selected?: boolean;
    onClick?: () => void;
}

export function Step({ number, last, selected, onClick }: StepProps) {
    return (
        <button
            className="h-[50px] flex-1 flex items-center group cursor-pointer rounded-[10px] focus-ring
                transition-colors duration-40 hover:bg-black/4 active:bg-black/6"
            onClick={onClick}
        >
            <div className="flex-1 h-[2px] group-not-first:bg-black/15"/>
            <div className={clsx("mx-[2px] size-[30px] rounded-[10px] flex items-center justify-center",
                "text-[14px] font-[450]",
                (selected) ? "bg-teal-70 text-white" : "bg-black/10 text-gray-70")}>
                {(last) ? (
                    <FlagIcon className="size-[14px]"/>
                ) : (
                    number
                )}
            </div>
            <div className="flex-1 h-[2px] group-not-last:bg-black/15"/>
        </button>
    );
}
