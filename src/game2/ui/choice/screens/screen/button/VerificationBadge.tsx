import clsx from "clsx";
import { ApplyIcon, CloseIcon } from "src/ui";

export interface VerificationBadgeProps {
    correct: boolean;
}

export function VerificationBadge({ correct }: VerificationBadgeProps) {
    return (
        <div className={clsx("size-[28px] absolute top-[8px] right-[8px] rounded-[12px] rounded-bl-[2px]",
            "flex items-center justify-center",
            (correct) ? "bg-teal-70 dark:bg-teal-75" : "bg-gray-10 dark:bg-black")}>
            {(correct)
                ? <ApplyIcon className="size-[12px] text-white"/>
                : <CloseIcon className="size-[12px] text-red-70 dark:text-red-50"/>}
        </div>
    )
}
