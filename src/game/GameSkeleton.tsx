import { GameLayout, ViewContainer } from "./common";

export function GameSkeleton() {
    return (
        <GameLayout className="animate-slow-delayed-fade-in">
            <ViewContainer>
                <div className="size-full bg-gray-10 animate-pulse"/>
            </ViewContainer>

            <div className="w-[400px] rounded-[20px] bg-gray-10 animate-pulse"/>
        </GameLayout>
    );
}
