import { useContext } from "react";
import { countryShapes } from "src/data/countryShapes";
import { Border, Map } from "src/map";
import { MapGameStoreContext } from "../../storeContext";
import { GameFeature } from "./GameFeature";
import { VoivodeshipBorders } from "./VoivodeshipBorders";

export function GameMap() {
    const useMapGameStore = useContext(MapGameStoreContext);
    const options = useMapGameStore((game) => game.options);
    const featureIds = useMapGameStore((game) => game.featureIds);

    return (
        <Map
            worldSize={{ width: 2000, height: 2000 }}
            border={{ left: 20, right: 20, top: 20, bottom: 90 }}
            className="absolute size-full"
        >
            {countryShapes.map((shape) =>
                <Border
                    key={shape.id}
                    shape={shape.outline}
                />
            )}

            {featureIds.map((featureId) =>
                <GameFeature
                    key={featureId}
                    featureId={featureId}
                />
            )}

            {options.unitType === "county" && (
                <VoivodeshipBorders/>
            )}
        </Map>
    );
}
