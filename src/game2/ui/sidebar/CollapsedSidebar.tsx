import { SidebarIcon } from "src/ui";

export interface CollapsedSidebarProps {
    onExpand: () => void;
}

export function CollapsedSidebar({ onExpand }: CollapsedSidebarProps) {
    return (
        <button
            className="absolute right-[20px] top-[20px] size-[54px] rounded-[16px] flex items-center justify-center
                group cursor-pointer bg-white dark:bg-black shadow-sm shadow-black/10"
            onClick={onExpand}
        >
            <SidebarIcon/>
            <div className="absolute left-[6px] top-[6px] right-[6px] bottom-[6px] rounded-[10px]
                transition-colors duration-80
                bg-transparent group-hover:bg-black/8 group-active:bg-black/10
                dark:group-hover:bg-white/5 dark:group-active:bg-white/10"/>
        </button>
    );
}
