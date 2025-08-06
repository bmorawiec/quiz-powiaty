import type { ReactNode } from "react";
import { useBreakpoints } from "../breakpoints";
import { MobileNav } from "./mobileNav";
import { Nav } from "./nav";

export interface PageLayoutProps {
    children?: ReactNode
}

export function PageLayout({ children }: PageLayoutProps) {
    const layout = useBreakpoints();
    return (
        <div className="h-full bg-white dark:bg-black text-gray-90 dark:text-gray-15 flex flex-col">
            {(layout === "sm" || layout === "md") ? (
                <MobileNav   />
            ) : (
                <Nav   />
            )}

            {children}
        </div>
    );
}
