import clsx from "clsx";
import type { AriaAttributes, AriaRole, ComponentType } from "react";

export interface NavIconButtonProps {
    icon: ComponentType;
    role?: AriaRole;
    ariaLabel?: string;
    ariaHasPopup?: AriaAttributes["aria-haspopup"];
    className?: string;
    onClick?: () => void;
}

export function NavIconButton({ icon: Icon, role, ariaLabel, ariaHasPopup, className, onClick }: NavIconButtonProps) {
    return (
        <button
            role={role}
            aria-label={ariaLabel}
            aria-haspopup={ariaHasPopup}
            className={clsx("size-[50px] shrink-0 flex items-center justify-center cursor-pointer rounded-full",
                "hover:bg-gray-10 active:bg-gray-15 dark:hover:bg-gray-85 dark:active:bg-gray-90",
                "transition-colors duration-80", className)}
            onClick={onClick}
        >
            <Icon/>
        </button>
    );
}
