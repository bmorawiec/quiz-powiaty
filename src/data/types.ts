export interface Unit {
    id: string;
    tags: UnitTag[];
    propertyIds: string[];
}

export type UnitTag =
    | "cityCounty"          /** The tagged unit is a city on county rights */
    | "landCounty";         /** The tagged unit isn't a city on county rights (sometimes called a land county) */

export type PropertyType = Property["type"];
export type Property = TextProperty | ImageProperty | ShapeProperty;

export interface TextProperty {
    type: "text";
    tag: TextPropertyTag;
    text: string;
}

export interface ImageProperty {
    type: "image";
    tag: ImagePropertyTag;
    url: string;
}

export interface ShapeProperty {
    type: "shape";
    tag: ShapePropertyTag;
    position: [number, number];
    size: [number, number];
    shape: number[][];
}

export type PropertyTag = TextPropertyTag | ImagePropertyTag | ShapePropertyTag;

export type TextPropertyTag =
    /** Properties with this tag should be of type TextProperty and will contain the full name
     *  of an administrative unit.
     *  @example Example content: "województwo podkarpackie" for the Subcarpathian voivodeship */
    | "name"
    /** Properties with this tag should be of type TextProperty. Some counties in Poland have the same name.
     *  Properties with this tag will contain the full name of an administrative unit.
     *  @example Example content: "powiat krośnieński (Krosno Odrzańskie)" and "powiat krośnieński (Krosno)" */
    | "unambiguousName"
    /** Properties with this tag should be of type TextProperty and will contain the short name
     *  of an administrative unit.
     *  @example Example content: "podkarpackie" for the Subcarpathian voivodeship */
    | "shortName"
    /** Properties with this tag should be of type TextProperty and will contain one of the capitals
     *  of an administrative unit.
     *  @example Example content: "Rzeszów" for the Subcarpathian voivodeship */
    | "capital"
    /** Properties with this tag should be of type TextProperty and will contain one of the registration plates
     *  of an administrative unit.
     *  @example Example content: "Rzeszów" for the Subcarpathian voivodeship */
    | "plate"

export type ImagePropertyTag =
    /** Properties with this tag should be of type ImageProperty and will link to the flag of an administrative unit. */
    | "flag"
    /** Properties with this tag should be of type ImageProperty and will link to the coat of arms
     *  of an administrative unit. */
    | "coa"

export type ShapePropertyTag =
    /** Properties with this tag should be of type ShapeProperty and will contain the shape
     *  of an administrative unit. */
    | "shape";

export const voivodeshipCodes = ["02", "04", "06", "08", "10", "12", "14", "16",
    "18", "20", "22", "24", "26", "28", "30", "32"] as const;
export type VoivodeshipCode = (typeof voivodeshipCodes)[number];
