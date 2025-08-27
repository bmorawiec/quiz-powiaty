import { useLayoutEffect, useRef, useState, type ReactNode } from "react";
import type { Box, Size } from "src/utils/vector";
import { Viewport } from "./Viewport";

export interface MapProps {
    worldSize: Size;
    border?: Box;
    children?: ReactNode;
    className?: string;
}

export function Map({ className, ...viewportProps }: MapProps) {
    const container = useRef<HTMLDivElement | null>(null);
    const [containerSize, setContainerSize] = useState<Size | null>(null);
    useLayoutEffect(() => {
        const updateContainerSize = () => {
            setContainerSize({
                width: container.current!.clientWidth,
                height: container.current!.clientHeight,
            });
        };
        updateContainerSize();  // set initial container size

        // assume container will only resize when window resizes
        window.addEventListener("resize", updateContainerSize);
        return () => window.removeEventListener("resize", updateContainerSize);
    }, []);

    const [hover, setHover] = useState(false);

    const handlePointerMove = () => {
        setHover(true);
    };

    const handlePointerLeave = () => {
        setHover(false);
    };

    return (
        <div
            ref={container}
            className={"overflow-clip bg-grass-10 dark:bg-gray-90 " + className}
            onPointerMove={handlePointerMove}
            onPointerLeave={handlePointerLeave}
        >
            {containerSize && (
                <Viewport
                    active={hover}
                    size={containerSize}
                    {...viewportProps}
                />
            )}
        </div>
    );
}
