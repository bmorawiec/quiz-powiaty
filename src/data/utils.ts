import type { Property, Unit } from "./types";

/** Returns properties from the `properties`, that are linked to by `unit`. */
export function getUnitProperties(unit: Unit, properties: Record<string, Property>) {
    const unitProperties: Property[] = [];
    for (const propertyId of unit.propertyIds) {
        const property = properties[propertyId];
        if (property) {
            unitProperties.push(property);
        }
    }
    return unitProperties;
}
