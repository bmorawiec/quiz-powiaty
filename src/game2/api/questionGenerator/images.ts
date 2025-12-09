import type { Unit } from "src/data/common";

const FLAG_IMAGE_PATH = "/images/flag/";
const COA_IMAGE_PATH = "/images/coa/";
const IMAGE_EXTENSION = ".svg";

export function getFlagURL(unit: Unit) {
    return FLAG_IMAGE_PATH + unit.id + IMAGE_EXTENSION;
}

export function getCOAURL(unit: Unit) {
    return COA_IMAGE_PATH + unit.id + IMAGE_EXTENSION;
}
