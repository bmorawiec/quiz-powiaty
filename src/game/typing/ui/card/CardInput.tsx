import clsx from "clsx";
import { useRef, type KeyboardEvent as ReactKeyboardEvent } from "react";
import { SendIcon } from "src/ui";
import { focusNextInput } from "src/utils/focusNextInput";
import { useAnimation } from "src/utils/useAnimation";
import type { GuessResult } from "../../state";

export interface CardInputProps {
    textTransform?: "uppercase" | "capitalize";
    slotIndex: number;
    className?: string;
    onGuess: (text: string, slotIndex: number) => GuessResult;
}

export function CardInput({ textTransform, slotIndex, className, onGuess }: CardInputProps) {
    const input = useRef<HTMLInputElement | null>(null);

    const [isWrongAnim, startWrongAnim] = useAnimation(450);

    const guess = () => {
        const text = input.current!.value;
        const result = onGuess(text, slotIndex);
        if (result === "correct") {
            focusNextInput();
        } else if (result === "wrong") {
            startWrongAnim();
        }
        input.current!.value = "";
    };

    const handleInputKeyDown = (event: ReactKeyboardEvent) => {
        if (event.key === "Enter") {
            guess();
        }
    };

    return (
        <div className={clsx("relative h-[32px]", isWrongAnim && "animate-shake", className)}>
            <input
                ref={input}
                type="text"
                className={clsx("size-full border border-gray-20 rounded-[6px] focus-ring pl-[6px]",
                    "text-[14px] peer", textTransform)}
                onKeyDown={handleInputKeyDown}
            />
            <button 
                tabIndex={-1}
                className="opacity-0 pointer-events-none peer-focus:opacity-100 focus:opacity-100
                    peer-focus:pointer-events-auto focus:pointer-events-auto cursor-pointer rounded-[6px]
                    flex items-center justify-center absolute w-[28px] h-[24px] right-[4px] top-[4px]
                    transition-colors duration-[80ms] bg-teal-70 hover:bg-teal-65 text-white dark:text-gray-95"
                onClick={guess}
            >
                <SendIcon className="size-[12px]"/>
            </button>
        </div>
    );
}
