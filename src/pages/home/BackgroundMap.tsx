import { UnitShapeNotFoundError } from "src/data/common";
import { units } from "src/data/units";
import { unitShapes } from "src/data/unitShapes";
import { Border, Feature, Map } from "src/map";
import { useBreakpoints } from "src/ui";
import { MapPlaceholder } from "./MapPlaceholder";

const countyShapes = units
    .filter((unit) => unit.type === "county")
    .map((county) => {
        const shape = unitShapes.find((shape) => shape.id === county.id);
        if (!shape) throw new UnitShapeNotFoundError(county.id);
        return shape;
    });

const voivodeshipShapes = units
    .filter((unit) => unit.type === "voivodeship")
    .map((county) => {
        const shape = unitShapes.find((shape) => shape.id === county.id);
        if (!shape) throw new UnitShapeNotFoundError(county.id);
        return shape;
    });

export function BackgroundMap() {
    const layout = useBreakpoints();
    if (layout === "xs") {
        return <MapPlaceholder/>;
    }
    return (
        <Map
            worldSize={{
                width: 2000,
                height: 2000,
            }}
            border={{
                left: (layout === "xl") ? 610 : 510,
                right: 30,
                top: 30,
                bottom: 30,
            }}
            className="absolute size-full"
        >
            {countyShapes.map((shape) =>
                <Feature
                    key={shape.id}
                    shape={shape.outline.hq}
                />
            )}

            {voivodeshipShapes.map((shape) =>
                <Border
                    key={shape.id}
                    shape={shape.outline.hq}
                />
            )}
        </Map>
    );
}
