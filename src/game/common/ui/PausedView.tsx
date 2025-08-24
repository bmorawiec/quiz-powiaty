import { Button, PauseIcon, PlayIcon } from "src/ui";

export interface PausedViewProps {
    onUnpauseClick: () => void;
}

export function PausedView({ onUnpauseClick }: PausedViewProps) {
    return (
        <div className="flex-1 bg-gray-5 dark:bg-gray-95 sm:rounded-[20px] flex items-center justify-center gap-[8px]">
            <PauseIcon/>
            <span className="mr-[20px]">Gra została zapauzowana</span>
            <Button
                icon={PlayIcon}
                text="Wznów"
                onClick={onUnpauseClick}
            />
        </div>
    );
}
