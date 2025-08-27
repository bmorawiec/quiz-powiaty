import { type ReactNode, type PointerEvent as ReactPointerEvent } from "react";

export interface DialogRootProps {
    onScrimPointerDown?: () => void;
    children?: ReactNode;
}

export function DialogRoot({ onScrimPointerDown, children }: DialogRootProps) {
    const handlePointerDown = (event: ReactPointerEvent) => {
        if (event.target === event.currentTarget) {
            onScrimPointerDown?.();
        }
    };

    return (
        <div
            className="fixed left-0 top-0 size-full bg-black/20 dark:bg-black/40 flex items-center justify-center"
            onPointerDown={handlePointerDown}
        >
            {children}
        </div>
    );
}
