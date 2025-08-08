import type { ReactNode } from "react";

export interface GameLayoutProps {
    children?: ReactNode;
}

export function GameLayout({ children }: GameLayoutProps) {
    return (
        <div className="flex-1 flex gap-[16px] md:px-[20px] lg:px-[100px] md:pb-[38px]">
            {children}
        </div>
    );
}
