import { useEffect, useState, type ReactNode } from "react";
import { Drawer, useBreakpoints } from "src/ui";
import type { GameState } from "../../state";

export interface SidebarProps {
    gameState: GameState;
    children?: ReactNode;
}

export function Sidebar({ gameState, children }: SidebarProps) {
    const [expanded, setExpanded] = useState(false);

    useEffect(() => {
        const shouldBeExpanded = gameState === "paused";
        setExpanded(shouldBeExpanded);
    }, [gameState]);

    const layout = useBreakpoints();
    if (layout === "xs" || layout === "sm") {
        return (
            <Drawer
                expanded={expanded}
                onExpandedChange={setExpanded}
                collapsedHeight={77}
            >
                {children}
            </Drawer>
        );
    }

    return (
        <div className="bg-white dark:bg-gray-95 w-[400px] rounded-[20px] flex flex-col shadow-sm shadow-black/10
            overflow-hidden">
            {children}
        </div>
    );
}
