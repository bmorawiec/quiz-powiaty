import { PauseIcon } from "src/ui";

export function PausedView() {
    return (
        <div className="size-full bg-gray-5 dark:bg-gray-95 flex items-center justify-center gap-[8px]">
            <div className="px-[30px] h-[60px] flex items-center gap-[10px] rounded-[10px]
                bg-white dark:bg-black">
                <PauseIcon className="size-[14px]"/>
                <p>Gra zapauzowana</p>
            </div>
        </div>
    );
}
