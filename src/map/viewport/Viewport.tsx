import { Application, extend, type ApplicationRef } from "@pixi/react";
import clsx from "clsx";
import { Container } from "pixi.js";
import {
    useEffect,
    useMemo,
    useRef,
    useState,
    type ReactNode,
    type PointerEvent as ReactPointerEvent,
    type WheelEvent as ReactWheelEvent
} from "react";
import { useDevicePixelRatio } from "src/utils/useDevicePixelRatio";
import type { Box, Size, Vector } from "src/utils/vector";
import { WorldTransformContext, type WorldTransform } from "./worldTransform";

export interface ViewportProps {
    active: boolean;
    size: Size;
    worldSize: Size;
    border?: Box;
    children?: ReactNode;
}

extend({
    Container,
});

const DRAG_THRESHOLD = 10;

/*  Anatomy of the viewport:
 *  +-----------------------------------------+
 *  | container     B O R D E R               |
 *  |   +---------------------------------+   |
 *  | B | view                            | B |
 *  | O |         +------------------+    | O |
 *  | R |         | world            |    | R |
 *  | D |         |                  |    | D |
 *  | E |         +------------------+    | E |
 *  | R |                                 | R |
 *  |   +---------------------------------+   |
 *  |               B O R D E R               |
 *  +-----------------------------------------+
 *
 *  container   A div containing the PIXI application.
 *
 *  view        The size of this area is determined by the size of the borders as defined in props.
 *
 *  world       Contains all the features. The user can pan and zoom into this part of the map.
 *              The world is initially scaled down so that it fills the view.
 *              It can also be additionally scaled through changing the zoom. The world can be moved via panning. */
export function Viewport({
    active,
    size,
    worldSize,
    border = { left: 0, right: 0, top: 0, bottom: 0 },
    children,
}: ViewportProps) {
    const appRef = useRef<ApplicationRef | null>(null);
    const dpr = useDevicePixelRatio();
    useEffect(() => {
        const app = appRef.current?.getApplication();
        if (app) {
            app.renderer.resolution = dpr;      // update device pixel ratio of pixi app when it changes
        }
    }, [dpr]);

    const container = useRef<HTMLDivElement | null>(null);

    // size of container minus the borders
    const viewSize = useMemo(() => ({
        width: size.width - border.left - border.right,
        height: size.height - border.top - border.bottom,
    }), [size, border]);

    const [offset, setOffset] = useState<Vector>({ x: 0, y: 0 });       // changes on user pan and zoom
    const [zoom, setZoom] = useState(1);        // changes on user zoom

    // how much the world needs to be scaled down to fit into the view
    const fitScale = useMemo(() => {
        const scaleX = viewSize.width / worldSize.width;
        const scaleY = viewSize.height / worldSize.height;
        return Math.min(scaleX, scaleY);
    }, [viewSize, worldSize]);

    const worldPos = useMemo(() => {
        return {
            x: border.left + (viewSize.width - fitScale * worldSize.width) / 2 + fitScale * offset.x,
            y: border.top + (viewSize.height - fitScale * worldSize.height) / 2 + fitScale * offset.y,
        };
    }, [border, offset, fitScale, viewSize, worldSize]);

    const worldTransform = useMemo<WorldTransform>(() => ({
        position: worldPos,
        scale: fitScale * zoom,
    }), [worldPos, fitScale, zoom]);

    const [panState, setPanState] = useState<"pointerDown" | "panning" | null>(null);
    const initialOffset = useRef<Vector>({ x: 0, y: 0 });
    const initialPointerPos = useRef<Vector>({ x: 0, y: 0 });

    useEffect(() => {
        if (panState) {
            const handleDocumentPointerMove = (event: PointerEvent) => {
                if (panState === "pointerDown") {
                    const absDiffX = Math.abs(event.clientX - initialPointerPos.current.x);
                    const absDiffY = Math.abs(event.clientY - initialPointerPos.current.y);
                    if (absDiffX > DRAG_THRESHOLD || absDiffY > DRAG_THRESHOLD) {
                        setPanState("panning");
                    }
                } else {
                    const scaledDiffX = (event.clientX - initialPointerPos.current.x) / fitScale;
                    const scaledDiffY = (event.clientY - initialPointerPos.current.y) / fitScale;
                    setOffset({
                        x: initialOffset.current.x + scaledDiffX,
                        y: initialOffset.current.y + scaledDiffY,
                    });
                }
            };

            const handleDocumentPointerUp = () => {
                setPanState(null);
            };

            document.addEventListener("pointermove", handleDocumentPointerMove);
            document.addEventListener("pointerup", handleDocumentPointerUp);
            return () => {
                document.removeEventListener("pointermove", handleDocumentPointerMove);
                document.removeEventListener("pointerup", handleDocumentPointerUp);
            };
        }
    }, [fitScale, panState]);

    const handlePointerDown = (event: ReactPointerEvent) => {
        if (event.button === 0) {
            initialOffset.current = offset;
            initialPointerPos.current = {
                x: event.clientX,
                y: event.clientY,
            };
            setPanState("pointerDown");
        }
    };

    const handleWheel = (event: ReactWheelEvent) => {
        const mult = (event.deltaY < 0) ? 1.5 : 1 / 1.5;

        const ratio = 1 - mult;
        const dx = (event.nativeEvent.offsetX - worldPos.x) * ratio / fitScale;
        const dy = (event.nativeEvent.offsetY - worldPos.y) * ratio / fitScale;

        setOffset({
            x: offset.x + dx,
            y: offset.y + dy,
        });
        setZoom(zoom * mult);
    };

    return (
        <div
            ref={container}
            className={clsx("size-full", panState === "panning" && "cursor-move")}
            onPointerDown={handlePointerDown}
            onWheel={handleWheel}
        >
            <Application
                ref={appRef}
                className="absolute size-full"
                resizeTo={container}
                backgroundAlpha={0}
                antialias
                resolution={dpr}
            >
                <WorldTransformContext value={worldTransform}>
                    <pixiContainer
                        sortableChildren
                        eventMode={(panState === "panning" || !active) ? "none" : "auto"}
                        position={worldTransform.position}
                        scale={worldTransform.scale}
                    >
                        {children}
                    </pixiContainer>
                </WorldTransformContext>
            </Application>
        </div>
    );
}
