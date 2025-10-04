import { useContext, useEffect } from "react";
import type { GameOptions } from "src/gameOptions";
import { focusNextInput } from "src/utils/focusNextInput";
import { TypingGameStoreContext } from "../storeContext";
import { Table } from "./Table";
import { ImageTable } from "./ImageTable";

export function View() {
    const useTypingGameStore = useContext(TypingGameStoreContext);

    const options = useTypingGameStore((game) => game.options);
    const title = useTypingGameStore((state) => state.title);

    useEffect(() => {
        focusNextInput();       // focus first input that can be focused
    }, []);

    const textTransform = getTextTransform(options);

    return (
        <div className="relative size-full bg-gray-5 dark:bg-gray-95 flex flex-col items-center
            pt-[48px] pb-[50px] max-sm:pb-[300px] px-[20px] overflow-y-auto">

            <h2 className="text-[20px] font-[500] mb-[28px] text-gray-80 dark:text-gray-10 text-center">
                {title}
            </h2>

            {(options.guessFrom === "flag" || options.guessFrom === "coa") ? (
                <ImageTable textTransform={textTransform}/>
            ) : (
                <Table textTransform={textTransform}/>
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
