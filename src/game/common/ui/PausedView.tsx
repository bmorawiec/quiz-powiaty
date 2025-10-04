import { Button, PauseIcon, PlayIcon } from "src/ui";

export interface PausedViewProps {
    onUnpauseClick: () => void;
}

export function PausedView({ onUnpauseClick }: PausedViewProps) {
    return (
        <div className="size-full bg-gray-5 dark:bg-gray-95 flex items-center justify-center gap-[8px]">
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
