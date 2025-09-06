import { useEffect } from "react";
import type { GameOptions } from "src/gameOptions";
import { focusNextInput } from "src/utils/focusNextInput";
import { useTypingGameStore } from "../state";
import { CardList } from "./CardList";
import { ImageCardList } from "./ImageCardList";

export interface ViewProps {
    options: GameOptions;
}

export function View({ options }: ViewProps) {
    const title = useTypingGameStore((state) => state.title);

    useEffect(() => {
        focusNextInput();       // focus first input that can be focused
    }, []);

    const textTransform = getTextTransform(options);

    return (
        <div className="relative flex-1 bg-gray-5 dark:bg-gray-95 sm:rounded-[20px] flex flex-col items-center 
            pt-[48px] pb-[50px] max-sm:pb-[300px] px-[20px] overflow-y-auto">

            <h2 className="text-[20px] font-[500] mb-[28px] text-gray-80 dark:text-gray-10 text-center">
                {title}
            </h2>

            {(options.guessFrom === "flag" || options.guessFrom === "coa") ? (
                <ImageCardList textTransform={textTransform}/>
            ) : (
                <CardList textTransform={textTransform}/>
            )}
        </div>
    );
}

function getTextTransform(options: GameOptions): "uppercase" | "capitalize" | undefined {
    if (options.guess === "capital") {
        return "capitalize";
    } else if (options.guess === "plate") {
        return "uppercase";
    }
}
