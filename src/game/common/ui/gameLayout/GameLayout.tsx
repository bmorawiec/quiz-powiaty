import clsx from "clsx";
import type { ReactNode } from "react";

export interface GameLayoutProps {
    fullscreen?: boolean;
    children?: ReactNode;
    className?: string;
}

export function GameLayout({ fullscreen, children, className }: GameLayoutProps) {
    return (
        <div
            className={clsx("size-full flex gap-[16px] sm:px-[20px] min-h-[600px]", className,
                (fullscreen)
                    ? "py-[20px]"
                    : "lg:px-[100px] sm:pb-[38px]")}
        >
            {children}
        </div>
    );
}
