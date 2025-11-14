import { extend } from "@pixi/react";
import { CanvasTextMetrics, Container, Graphics, Text, TextStyle } from "pixi.js";
import { useCallback, useContext, useMemo } from "react";
import { colors } from "src/utils/colors";
import type { Vector } from "src/utils/geometry";
import { getPixelPerfectPosition, WorldTransformContext } from "./viewport";

export interface TooltipProps {
    position: Vector;
    text: string;
}

extend({
    Container,
    Graphics,
    Text,
});

const textStyle = new TextStyle({
    fontFamily: "Geist",
    fontSize: 14,
});

const PADDING_X = 10;
const PADDING_Y = 5;

/** Shows a tooltip at the specified position. */
export function Tooltip({ position, text }: TooltipProps) {
    const worldTransform = useContext(WorldTransformContext);

    const textMetrics = useMemo(
        () => CanvasTextMetrics.measureText(text, textStyle),
        [text],
    );

    const redrawBackground = useCallback((g: Graphics) => {
        g.clear();
        g.moveTo(0, 0);
        g.lineTo(-10, -10);
        g.lineTo(10, -10);


        const rectWidth = textMetrics.width + 2 * PADDING_X;
        const rectHeight = textMetrics.height + 2 * PADDING_Y;
        g.roundRect(-rectWidth / 2, -rectHeight - 10, rectWidth, rectHeight, 6);

        g.fill({
            color: colors.white,
        });
    }, [textMetrics]);

    return (
        <pixiContainer
            position={getPixelPerfectPosition(position, worldTransform)}
            scale={1 / worldTransform.scale}
            zIndex={99_999}
        >
            <pixiGraphics draw={redrawBackground}/>

            <pixiText
                position={{
                    x: -Math.round(textMetrics.width / 2),
                    y: -10 - PADDING_Y - textMetrics.height,
                }}
                text={text}
                style={textStyle}
            />
        </pixiContainer>
    );
}
