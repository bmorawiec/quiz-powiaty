export class UnitNotFoundError extends Error {
    name = "UnitNotFoundError";

    constructor(unitId: string) {
        super("Couldn't find administrative unit with ID: " + unitId);
    }
}

export class UnitShapeNotFoundError extends Error {
    name = "UnitShapeNotFoundError";

    constructor(unitId: string) {
        super("Couldn't find shape of administrative unit with ID: " + unitId);
    }
}
