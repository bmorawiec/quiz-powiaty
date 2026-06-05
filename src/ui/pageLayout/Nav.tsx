import { HomeLink } from "./HomeLink";

export function Nav() {
    return (<>
        <nav className="fixed z-1000 top-0 left-0 w-full h-[70px] flex items-center pl-[14px]
            bg-gray-5 dark:bg-gray-95">
            <HomeLink/>
        </nav>

        <div className="fixed z-1000 top-[70px] left-0 w-[78px] bottom-0 bg-gray-5 dark:bg-gray-95">
        </div>

        <div        // rounded corner
            className="pointer-events-none fixed z-1000 top-[60px] left-[68px]
                size-[20px] border-gray-5 dark:border-gray-95 border-l-[10px] border-t-[10px] rounded-tl-[20px]"
        />
    </>);
}
