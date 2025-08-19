import { Outlet } from "react-router";
import { useBreakpoints } from "../breakpoints";
import { MobileNav } from "./mobileNav";
import { Nav } from "./nav";

export function PageLayout() {
    const layout = useBreakpoints();
    return (
        <div className="h-full bg-white dark:bg-black text-gray-90 dark:text-gray-15 flex flex-col">
            {(layout === "xs" || layout === "sm") ? (
                <MobileNav/>
            ) : (
                <Nav/>
            )}
            <Outlet/>
        </div>
    );
}
