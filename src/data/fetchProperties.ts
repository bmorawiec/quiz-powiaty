import type { Property, PropertyTag, VoivodeshipCode } from "./types";

/** Returns properties (of all voivodeships) tagged with the specified tags. */
export async function fetchVoivodeshipProperties(tags: PropertyTag[]) {
    const promises = tags.map((tag) => fetchVoivodeshipPropertiesFile(tag));
    const propertyObjects = await Promise.all(promises);

    let properties: Record<string, Property> = {};
    for (const object of propertyObjects) {
        properties = {
            ...properties,
            ...object,
        };
    }

    return properties;
}

/** Returns properties (of all voivodeships) tagged with the specified tag. */
async function fetchVoivodeshipPropertiesFile(tag: PropertyTag) {
    const response = await fetch("/data/voivodeships/properties/" + tag + ".json");
    if (!response.ok) {
        throw new Error("Response status was: " + response.status);
    }

    const properties = await response.json();
    return properties;
}

/** Returns properties (of counties in the listed voivodeships) tagged with the specified tags. */
export async function fetchCountyProperties(
    voivodeships: VoivodeshipCode[],
    tags: PropertyTag[],
): Promise<Record<string, Property>> {
    const promises = voivodeships.flatMap((voivodeship) =>
        tags.map((tag) => fetchCountyPropertiesFile(voivodeship, tag)));
    const propertyObjects = await Promise.all(promises);

    let properties: Record<string, Property> = {};
    for (const object of propertyObjects) {
        properties = {
            ...properties,
            ...object,
        };
    }

    return properties;
}

/** Returns properties (of counties in the provided voivodeship) tagged with the specified tag. */
async function fetchCountyPropertiesFile(
    voivodeship: VoivodeshipCode,
    tag: PropertyTag,
): Promise<Record<string, Property>> {
    const response = await fetch("/data/properties/" + tag + voivodeship + ".json");
    if (!response.ok) {
        throw new Error("Response status was: " + response.status);
    }

    const properties = await response.json();
    return properties;
}
