import { useState } from "react";
import { UnitShapeNotFoundError, type Unit } from "src/data/common";
import { unitShapes } from "src/data/unitShapes";
import { Feature, Tooltip } from "src/map";

export interface BgFeatureProps {
    unit: Unit;
}

export function BgFeature({ unit }: BgFeatureProps) {
    const shape = unitShapes.find((shape) => shape.id === unit.id);
    if (!shape)
        throw new UnitShapeNotFoundError(unit.id);

    const [hover, setHover] = useState(false);

    const handlePointerOver = () => {
        setHover(true);
    };

    const handlePointerOut = () => {
        setHover(false);
    };

    return (<>
        <Feature
            shape={shape.outline.hq}
            onPointerOver={handlePointerOver}
            onPointerOut={handlePointerOut}
        />

        {hover && (
            <Tooltip
                position={shape.center}
                text={unit.name}
            />
        )}
    </>);
}
