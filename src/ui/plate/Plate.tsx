import { Letter } from "./Letter";
import { PlateBackground, WidePlateBackground } from "./PlateBackground";

export interface PlateProps {
    code: string;
    /** The height of the license plate.
     *  @default 50 */
    height?: number;
}

/** Displays an SVG drawing of a Polish license registration plate with the specified code. */
export function Plate({ code, height = 50 }: PlateProps) {
    const viewBoxWidth = (code.length >= 3) ? 792 : 592;
    return (
        <svg height={height} viewBox={`0 0 ${viewBoxWidth} 356`} className="shrink-0">
            {(code.length >= 3)
                ? <WidePlateBackground/>
                : <PlateBackground/>}

            {code.split("").map((char, index) =>
                <svg x={190 + index * 180} y={55}>
                    <Letter letter={char}/>
                </svg>
            )}
        </svg>
    );
}
