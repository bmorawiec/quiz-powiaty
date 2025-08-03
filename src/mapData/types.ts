import type { Vector } from 'src/utils/vector';

/** Stores information about the shape of an administrative unit. */
export interface UnitShape {
    /** The TERC code of this administrative unit. */
    id: string;
    /** The shape of this administrative unit as svg path data. */
    outline: {
        lq: string;
        hq: string;
    };
    /** The center of this administrative unit. */
    center: Vector;
}
