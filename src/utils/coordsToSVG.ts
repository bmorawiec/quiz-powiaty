/** Converts shape coordinates to an SVG path.
 *  @param shape - The outline of the shape to convert in the form of an array of polygons. Each polygon is an array
 *  of numbers. A pair of numbers at an even index i in the array represents a point with coordinates x = array[i] and
 *  y = array[i+1]. */
export function coordsToSVG(shape: number[][]): string {
    const commands = [];
    for (const polygon of shape) {
        const firstX = polygon[0];
        const firstY = polygon[1];
        commands.push(`M ${firstX},${firstY}`);
        for (let i = 2; i < polygon.length; i += 2) {
            const x = polygon[i];
            const y = polygon[i + 1];
            commands.push(`L ${x},${y}`);
        }
    }
    return commands.join(" ");
}
