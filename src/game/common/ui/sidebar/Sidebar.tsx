import type { ReactNode } from "react";
import { Drawer, useBreakpoints } from "src/ui";

export interface SidebarProps {
    children?: ReactNode;
}

export function Sidebar({ children }: SidebarProps) {
    const layout = useBreakpoints();
    if (layout === "xs" || layout === "sm") {
        return (
            <Drawer collapsedHeight={77}>
                {children}
            </Drawer>
        );
    }

    return (
        <div className="bg-white dark:bg-gray-95 w-[400px] rounded-[20px] flex flex-col shadow-sm shadow-black/10
            overflow-hidden">
            {children}
        </div>
    );
}
