import type {
    Content,
    ImageContent,
    MultiplePlatesContent,
    ShapeContent,
    TallImageContent,
    TextContent,
    TitledImageContent,
} from "src/game2/questions";
import { Plate } from "src/ui";
import { coordsToSVG } from "src/utils/coordsToSVG";

export interface ButtonContentViewProps {
    content: Content;
}

export function ButtonContentView({ content }: ButtonContentViewProps) {
    if (content.type === "text") {
        return <TextContentView content={content}/>;
    } else if (content.type === "titledImage") {
        return <TitledImageContentView content={content}/>;
    } else if (content.type === "multiplePlates") {
        return <MultiplePlatesContentView content={content}/>
    } else if (content.type === "image") {
        return <ImageContentView content={content}/>
    } else if (content.type === "tallImage") {
        return <TallImageContentView content={content}/>
    } else if (content.type === "shape") {
        return <ShapeContentView content={content}/>
    }
    throw new Error("Not supported.");
}

interface TitledImageContentViewProps {
    content: TitledImageContent;
}

function TitledImageContentView({ content }: TitledImageContentViewProps) {
    return (
        <div className="h-[80px] font-[450] tracking-[0.01em] p-[10px] flex items-center justify-center">
            <div className="size-[50px] bg-white/8 rounded-[10px] flex items-center justify-center shrink-0">
                <img
                    src={content.url}
                    className="size-[40px]"
                />
            </div>
            <span className="flex-1 ml-[5px] mr-[20px]">
                {content.text}
            </span>
        </div>
    );
}

interface TextContentViewProps {
    content: TextContent;
}

function TextContentView({ content }: TextContentViewProps) {
    return (
        <div className="h-[80px] font-[450] tracking-[0.01em] p-[10px] flex items-center justify-center">
            {content.text}
        </div>
    );
}

interface MultiplePlatesContentViewProps {
    content: MultiplePlatesContent;
}

function MultiplePlatesContentView({ content }: MultiplePlatesContentViewProps) {
    const plateHeight = (content.codes.length >= 10) ? 15 : 25;
    return (
        <div className="h-[80px] flex content-center justify-center gap-[8px] flex-wrap">
            {content.codes.map((code) =>
                <Plate
                    key={code}
                    code={code}
                    height={plateHeight}
                />
            )}
        </div>
    );
}

interface ImageContentViewProps {
    content: ImageContent;
}

function ImageContentView({ content }: ImageContentViewProps) {
    return (
        <div className="h-[120px] p-[10px]">
            <img
                src={content.url}
                className="size-full"
            />
        </div>
    );
}

interface TallImageContentViewProps {
    content: TallImageContent;
}

function TallImageContentView({ content }: TallImageContentViewProps) {
    return (
        <div className="h-[160px] p-[10px]">
            <img
                src={content.url}
                className="size-full"
            />
        </div>
    );
}

interface ShapeContentViewProps {
    content: ShapeContent;
}

function ShapeContentView({ content }: ShapeContentViewProps) {
    const [shapeWidth, shapeHeight] = content.size;
    const svg = coordsToSVG(content.shape);
    return (
        <div className="h-[160px] p-[10px] flex items-center justify-center">
            <svg viewBox={`0 0 ${shapeWidth} ${shapeHeight}`} className="h-full">
                <path className="fill-teal-70 dark:fill-teal-65" d={svg}/>
            </svg>
        </div>
    );
}
