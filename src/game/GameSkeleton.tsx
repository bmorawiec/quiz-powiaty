import { useBreakpoints } from "src/ui";

export function GameSkeleton() {
    const layout = useBreakpoints();
    if (layout == "xs" || layout == "sm") {
        return null;
    }

    return (
        <div className="size-full sm:px-[20px] lg:px-[100px] sm:pb-[38px] min-h-[600px] flex gap-[16px]
            animate-slow-delayed-fade-in">
            <div className="flex-1 rounded-[20px] bg-gray-10 animate-pulse"/>
            <div className="w-[400px] rounded-[20px] bg-gray-10 animate-pulse"/>
        </div>
    );
}
