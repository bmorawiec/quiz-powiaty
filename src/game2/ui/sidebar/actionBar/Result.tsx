import { StatsIcon } from "src/ui";

export function Result() {
    return (
        <div className="flex items-center gap-[6px]">
            <StatsIcon className="size-[14px]"/>
            0/0pkt (0%)
        </div>
    );
}
