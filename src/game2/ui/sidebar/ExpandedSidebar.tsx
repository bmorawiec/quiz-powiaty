import { ActionBar } from "./ActionBar";
import { ComboPicker } from "./comboPicker";
import { GameStatus } from "./gameStatus/GameStatus";
import { OptionsSection } from "./optionsSection";

export interface ExpandedSidebarProps {
    onCollapse: () => void;
}

export function ExpandedSidebar({ onCollapse }: ExpandedSidebarProps) {
    return (
        <div className="shrink-0 bg-white dark:bg-gray-95 w-[400px] rounded-[20px] shadow-sm shadow-black/10
            flex flex-col overflow-y-auto">
            <ActionBar onCollapse={onCollapse}/>
            <ComboPicker/>
            <GameStatus/>
            <OptionsSection/>
        </div>
    );
}
