import { ApplyIcon } from "src/ui";

export interface GuessedAnswerProps {
    text: string;
}

export function GuessedAnswer({ text }: GuessedAnswerProps) {
    return (
        <div className="h-[32px] animate-correct border border-gray-20 rounded-[6px] flex items-center px-[7px]
            text-[14px] text-teal-80 gap-[4px]">
            <ApplyIcon className="size-[12px]"/>
            <span>
                {text}
            </span>
        </div>
    );
}
