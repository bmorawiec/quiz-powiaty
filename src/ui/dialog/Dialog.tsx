import clsx from "clsx";
import type { ReactNode } from "react";

export interface DialogProps {
    className?: string;
    children?: ReactNode;
}

export function Dialog({ className, children }: DialogProps) {
    return (
        <div className={clsx("bg-white dark:bg-black rounded-[20px] shadow-sm shadow-black/10 flex flex-col",
            className)}>
            {children}
        </div>
    );
}
