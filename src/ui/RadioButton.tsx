import clsx from "clsx";
import { RadioCheckedIcon, RadioIcon } from "./icons";

export interface RadioButtonProps {
    checked?: boolean;
    label: string;
    className?: string;
    onClick?: () => void;
}

export function RadioButton({ checked, label, className, onClick }: RadioButtonProps) {
    return (
        <button
            className={clsx("flex items-center px-[12px] h-[36px] gap-[8px] cursor-pointer",
                "rounded-[10px] transition-colors duration-20 focus-ring",
                "hover:bg-black/5 active:bg-black/8 dark:hover:bg-white/5 dark:active:bg-white/4", className)}
            onClick={onClick && (() => onClick())}
        >
            {(checked)
                ? <RadioCheckedIcon className="text-teal-70 dark:text-teal-60"/>
                : <RadioIcon className="text-gray-90 dark:text-gray-20"/>
            }

            <span>
                {label}
            </span>
        </button>
    );
}
