import { ApplyIcon } from "src/ui";

export interface GuessedAnswerProps {
    text: string;
}

export function GuessedAnswer({ text }: GuessedAnswerProps) {
    return (
        <div className="h-[32px] animate-correct dark:animate-correct-dark rounded-[6px] flex items-center px-[7px]
            text-[14px] gap-[4px] border
            border-gray-20 text-teal-80 dark:border-gray-65 dark:text-teal-55">
            <ApplyIcon className="size-[12px]"/>
            <span>
                {text}
            </span>
        </div>
    );
}
