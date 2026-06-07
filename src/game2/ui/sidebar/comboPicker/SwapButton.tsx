import clsx from "clsx";
import { SwapIcon } from "src/ui";

export interface SwapButtonProps {
    onClick: () => void;
    className?: string;
}

export function SwapButton({ onClick, className }: SwapButtonProps) {
    return (
        <button
            className={clsx("size-[30px] flex items-center justify-center cursor-pointer",
                "transition-colors duration-80",
                "rounded-[8px] hover:bg-black/5 active:bg-black/10", className)}
            onClick={onClick}
        >
            <SwapIcon className="size-[14px] text-gray-65"/>
        </button>
    );
}
