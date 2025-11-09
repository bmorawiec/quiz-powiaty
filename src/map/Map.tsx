import clsx from "clsx";
import { useEffect, useLayoutEffect, useRef, useState, type ReactNode } from "react";
import type { Box, Size } from "src/utils/vector";
import { Viewport } from "./viewport";

export interface MapProps {
    worldSize: Size;
    border?: Box;
    children?: ReactNode;
    className?: string;
}

export function Map({ className, ...viewportProps }: MapProps) {
    const container = useRef<HTMLDivElement | null>(null);
    const [containerSize, setContainerSize] = useState<Size>({ width: 100, height: 100 });
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

    const handlePointerEnter = () => {
        setHover(true);
    };

    const handlePointerLeave = () => {
        setHover(false);
    };

    // Wait until the containerSize and hover have their final values.
    // Quick changes in props to pixi components when they're first rendered cause the
    // values used by pixi.js to be out of date.
    const [ready, setReady] = useState(false);
    useEffect(() => {
        const timeout = setTimeout(() => {
            setReady(true);
        }, 10);
        return () => {
            clearTimeout(timeout);
        };
    }, []);

    return (
        <div
            ref={container}
            className={clsx("overflow-clip bg-grass-10 dark:bg-gray-90", className)}
            onPointerEnter={handlePointerEnter}
            onPointerLeave={handlePointerLeave}
        >
            {ready && (
                <Viewport
                    active={hover}
                    size={containerSize}
                    {...viewportProps}
                />
            )}
        </div>
    );
}
