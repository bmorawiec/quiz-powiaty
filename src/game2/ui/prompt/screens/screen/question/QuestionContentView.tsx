import type {
    Content,
    TextAndImageContent,
    TextAndMultiplePlatesContent,
    TextAndShapeContent,
    TextContent,
    TextWithInlineImageContent,
} from "src/game2/questions";
import { Plate } from "src/ui";
import { coordsToSVG } from "src/utils/coordsToSVG";

export interface QuestionContentViewProps {
    content: Content;
}

export function QuestionContentView({ content }: QuestionContentViewProps) {
    if (content.type === "textWithInlineImage") {
        return <TextWithInlineImageContentView content={content}/>;
    } else if (content.type === "text") {
        return <TextContentView content={content}/>;
    } else if (content.type === "textAndImage") {
        return <TextAndImageContentView content={content}/>;
    } else if (content.type === "textAndMultiplePlates") {
        return <TextAndMultiplePlatesContentView content={content}/>;
    } else if (content.type === "textAndShape") {
        return <TextAndShapeContentView content={content}/>;
    }
    throw new Error("Not supported.");
}

interface TextWithInlineImageContentViewProps {
    content: TextWithInlineImageContent;
}

function TextWithInlineImageContentView({ content }: TextWithInlineImageContentViewProps) {
    return (
        <h2 className="text-center text-[20px] font-[450] tracking-[0.01em] text-gray-85 dark:text-gray-10">
            {content.beforeText}
            <img
                src={content.imageUrl}
                className="inline-block h-[30px] mr-[3px]"
            />
            <span className="text-teal-70">
                {content.text}
            </span>
            {content.afterText}
        </h2>
    );
}

interface TextContentViewProps {
    content: TextContent;
}

function TextContentView({ content }: TextContentViewProps) {
    return (
        <h2 className="text-center text-[20px] font-[450] tracking-[0.01em] text-gray-85 dark:text-gray-10">
            {content.text}
        </h2>
    );
}

interface TextAndImageContentViewProps {
    content: TextAndImageContent;
}

function TextAndImageContentView({ content }: TextAndImageContentViewProps) {
    return (
        <div className="flex-1 flex flex-col items-center gap-[20px]">
            <h2 className="text-center text-[20px] font-[450] tracking-[0.01em] text-gray-85 dark:text-gray-10">
                {content.text}
            </h2>

            <div
                className="w-full flex-1 bg-contain bg-center bg-no-repeat"
                style={{
                    backgroundImage: `url(${content.url})`,
                }}
            />
        </div>
    );
}

interface TextAndMultiplePlatesContentViewProps {
    content: TextAndMultiplePlatesContent;
}

function TextAndMultiplePlatesContentView({ content }: TextAndMultiplePlatesContentViewProps) {
    const plateHeight = (content.codes.length >= 10) ? 25 : 50;
    return (
        <div className="flex flex-col gap-[20px]">
            <h2 className="text-center text-[20px] font-[450] tracking-[0.01em] text-gray-85 dark:text-gray-10">
                {content.text}
            </h2>

            <div className="flex flex-wrap p-[20px] content-center justify-center gap-[10px] rounded-[10px]
                min-h-[100px] bg-black/4 dark:bg-white/5">
                {content.codes.map((code) =>
                    <Plate
                        code={code}
                        height={plateHeight}
                    />
                )}
            </div>
        </div>
    );
}

interface TextAndShapeContentViewProps {
    content: TextAndShapeContent;
}

function TextAndShapeContentView({ content }: TextAndShapeContentViewProps) {
    const [shapeWidth, shapeHeight] = content.size;
    const svg = coordsToSVG(content.shape);
    return (
        <div className="flex-1 flex flex-col items-center gap-[20px]">
            <h2 className="text-center text-[20px] font-[450] tracking-[0.01em] text-gray-85 dark:text-gray-10">
                {content.text}
            </h2>

            <div className="flex-1 w-full relative">
                <svg viewBox={`0 0 ${shapeWidth} ${shapeHeight}`} className="absolute left-0 top-0 size-full">
                    <path className="fill-teal-70 dark:fill-teal-65" d={svg}/>
                </svg>
            </div>
        </div>
    );
}
