import { voivodeshipCodes, type Unit, type VoivodeshipCode } from "./types";

/** Returns an array containing all voivodeships. */
export async function fetchVoivodeships(): Promise<Unit[]> {
    const response = await fetch("/data/voivodeships/units.json");
    if (!response.ok) {
        throw new Error("Response status was: " + response.status);
    }

    const units = await response.json();
    return units;
}

/** Returns an array containing counties that are a part of one of the listed voivodeships.
 *  If the provided array is empty, then counties from all voivodeships will be fetched. */
export async function fetchCounties(voivodeships: readonly VoivodeshipCode[]): Promise<Unit[]> {
    if (voivodeships.length === 0) {
        voivodeships = voivodeshipCodes;
    }
    const promises = voivodeships.map((voivodeship) => fetchCountiesFile(voivodeship));
    const unitArrays = await Promise.all(promises);

    const units: Unit[] = [];
    for (const array of unitArrays) {
        units.push(...array);
    }

    return units;
}

/** Returns an array containing all counties that are part of the specified voivodeship. */
async function fetchCountiesFile(voivodeship: VoivodeshipCode): Promise<Unit[]> {
    const response = await fetch("/data/counties/units/" + voivodeship + ".json");
    if (!response.ok) {
        throw new Error("Response status was: " + response.status);
    }

    const units = await response.json();
    return units;
}
