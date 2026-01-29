import clsx from "clsx";
import type { ComponentType } from "react";
import type { IconProps } from "src/ui";

export interface IconButtonProps {
    icon: ComponentType<IconProps>;
    className?: string;
    onClick?: () => void;
}

export function IconButton({ icon: Icon, className, onClick }: IconButtonProps) {
    return (
        <button
            className={clsx("size-[36px] m-[-10px] rounded-[10px] flex items-center justify-center cursor-pointer",
                "transition-colors duration-[80ms] focus-ring",
                "hover:bg-black/8 active:bg-black/12 dark:hover:bg-white/8 dark:active:bg-white/4", className)}
            onClick={onClick}
        >
            <Icon/>
        </button>
    );
}
