import { ActionBar } from "./actionBar/ActionBar";
import { OptionsSection } from "./optionsSection";

export interface ExpandedSidebarProps {
    onCollapse: () => void;
}

export function ExpandedSidebar({ onCollapse }: ExpandedSidebarProps) {
    return (
        <div className="shrink-0 bg-white dark:bg-gray-95 w-[400px] rounded-[20px] shadow-sm shadow-black/10
            flex flex-col justify-between">

            <ActionBar
                onCollapse={onCollapse}
            />

            <OptionsSection/>
        </div>
    );
}
