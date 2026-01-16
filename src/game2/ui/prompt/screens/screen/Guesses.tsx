import clsx from "clsx";
import { useContext } from "react";
import type { Guess } from "src/game2/state";
import { ApplyIcon, CloseIcon } from "src/ui";
import { PromptGameStoreContext } from "../../hook";
import { getTextTransform } from "./textTransform";

export interface GuessesProps {
    guesses: Guess[];
}

export function Guesses({ guesses }: GuessesProps) {
    const usePromptGameStore = useContext(PromptGameStoreContext);
    const apiOptions = usePromptGameStore((game) => game.api.options);
    const textTransform = getTextTransform(apiOptions);

    return (
        <div className={clsx("w-full max-w-[700px] rounded-[10px] px-[15px] py-[13px] flex flex-col gap-[5px]",
            "bg-white bg-dark-95 border border-gray-20 dark:bg-white/5 dark:border-none overflow-y-auto",
            textTransform)}>
            {guesses.map((guess, index) =>
                <div
                    key={index}
                    className="flex items-center gap-[5px]"
                >
                    {guess.text}
                    {(guess.correct)
                        ? <ApplyIcon className="size-[14px] text-teal-75 dark:text-teal-60"/>
                        : <CloseIcon className="size-[14px] text-red-70 dark:text-red-60"/>}
                </div>
            )}
        </div>
    );
}
