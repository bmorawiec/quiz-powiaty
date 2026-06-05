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

export interface CellContentViewProps {
    content: Content;
}

export function CellContentView({ content }: CellContentViewProps) {
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

interface TextContentViewProps {
    content: TextContent;
}

function TextContentView({ content }: TextContentViewProps) {
    return (
        <div className="h-[40px] tracking-[0.01em] p-[12px] flex items-center">
            {content.text}
        </div>
    );
}

interface TitledImageContentViewProps {
    content: TitledImageContent;
}

function TitledImageContentView({ content }: TitledImageContentViewProps) {
    return (
        <div className="h-[42px] font-[450] tracking-[0.01em] p-[10px] flex items-center">
            <img
                src={content.url}
                className="size-[26px]"
            />
            <span className="flex-1 ml-[5px] mr-[20px]">
                {content.text}
            </span>
        </div>
    );
}

interface MultiplePlatesContentViewProps {
    content: MultiplePlatesContent;
}

function MultiplePlatesContentView({ content }: MultiplePlatesContentViewProps) {
    return (
        <div className="min-h-[40px] p-[10px] flex content-center gap-[8px] flex-wrap">
            {content.codes.map((code) =>
                <Plate
                    key={code}
                    code={code}
                    height={20}
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
        <div className="h-[100px] p-[5px]">
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
        <div className="h-[120px] p-[5px]">
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
        <div className="h-[120px] p-[15px] flex items-center">
            <svg viewBox={`0 0 ${shapeWidth} ${shapeHeight}`} className="h-full">
                <path className="fill-teal-70 dark:fill-teal-65" d={svg}/>
            </svg>
        </div>
    );
}
