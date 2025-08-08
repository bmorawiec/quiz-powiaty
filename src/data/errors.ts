export class UnitNotFoundError extends Error {
    name = "UnitNotFoundError";

    constructor(unitId: string) {
        super("Couldn't find administrative unit with ID: " + unitId);
    }
}
