export function GameSkeleton() {
    return (
        <div className="size-full flex gap-[16px] animate-slow-delayed-fade-in">
            <div className="flex-1 rounded-[20px] bg-gray-10 animate-pulse"/>
            <div className="w-[400px] rounded-[20px] bg-gray-10 animate-pulse"/>
        </div>
    );
}
