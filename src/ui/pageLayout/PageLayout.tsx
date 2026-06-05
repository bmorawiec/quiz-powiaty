import { Outlet } from "react-router";
import { Nav } from "./Nav";

export function PageLayout() {
    return (
        <div className="h-full bg-white dark:bg-black text-gray-90 dark:text-gray-15 flex flex-col
            pl-[78px] pt-[70px]">
            <Nav/>
            <Outlet/>
        </div>
    );
}
