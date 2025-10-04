import type { ReactNode } from "react";

export interface ViewContainerProps {
    children?: ReactNode;
}

export function ViewContainer({ children }: ViewContainerProps) {
    return (
        <div className="relative flex-1 sm:rounded-[20px] overflow-hidden">
            {children}
        </div>
    );
}
