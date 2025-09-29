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
            className={clsx("size-[36px] rounded-[6px] flex items-center justify-center cursor-pointer",
                "transition-colors duration-[80ms] focus-ring",
                "hover:bg-gray-10 active:bg-gray-15 dark:hover:bg-gray-85 dark:active:bg-gray-90", className)}
            onClick={onClick}
        >
            <Icon/>
        </button>
    );
}
