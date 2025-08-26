import { UnitShapeNotFoundError } from "src/data/common";
import { units } from "src/data/units";
import { unitShapes } from "src/data/unitShapes";
import { Border, Map } from "src/map";
import { useBreakpoints } from "src/ui";
import { BgFeature } from "./BgFeature";
import { BgMapPlaceholder } from "./BgMapPlaceholder";

const counties = units.filter((unit) => unit.type === "county");

const voivodeshipShapes = units
    .filter((unit) => unit.type === "voivodeship")
    .map((county) => {
        const shape = unitShapes.find((shape) => shape.id === county.id);
        if (!shape) throw new UnitShapeNotFoundError(county.id);
        return shape;
    });

export function BgMap() {
    const layout = useBreakpoints();
    if (layout === "xs") {
        return <BgMapPlaceholder/>;
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
            {counties.map((county) =>
                <BgFeature
                    key={county.id}
                    unit={county}
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
