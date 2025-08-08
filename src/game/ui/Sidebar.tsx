import type { ReactNode } from "react";

export interface SidebarProps {
    children?: ReactNode;
}

export function Sidebar({ children }: SidebarProps) {
    return (
        <div className="bg-white dark:bg-gray-95 w-[400px] rounded-[20px] shadow-sm shadow-black/10">
            {children}
        </div>
    )
}
