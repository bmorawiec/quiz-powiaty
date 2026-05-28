export class PropertyNotFoundError extends Error {
    name = "PropertyNotFoundError";
    constructor() {
        super("Couldn't find a property with the right tag.");
    }
}

export class UnexpectedPropertyTypeError extends Error {
    name = "UnexpectedPropertyTypeError";
    constructor() {
        super("Expected this property to be of a different type.");
    }
}
