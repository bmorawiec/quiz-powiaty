import clsx from "clsx";
import { useEffect, useRef, useState, type KeyboardEvent as ReactKeyboardEvent } from "react";
import { SendIcon } from "src/ui/icons";

export interface PromptInputProps {
    placeholder?: string;
    state?: "correct" | "alreadyGuessed" | "wrong";
    className?: string;
    onGuess?: (answer: string) => void;
}

export function PromptInput({ placeholder, state, className, onGuess }: PromptInputProps) {
    const [answer, setAnswer] = useState("");

    const input = useRef<HTMLInputElement>(null);

    useEffect(() => {
        input.current!.focus();         // focus input when component mounted
    }, []);

    const handleInputChange = () => {
        setAnswer(input.current!.value);
    };

    const handleInputKeyDown = (event: ReactKeyboardEvent) => {
        if (event.key === "Enter") {
            onGuess?.(answer);
            setAnswer("");
        }
    };

    const handleButtonClick = () => {
        onGuess?.(answer);
        setAnswer("");
    };

    return (
        <div className={clsx("h-[60px] border border-gray-20 dark:border-gray-65 rounded-[20px]",
            "bg-white dark:bg-gray-95 flex items-center pr-[9px]", className)}>
            <input
                ref={input}
                type="text"
                placeholder={placeholder}
                className="flex-1 h-full pl-[20px] rounded-s-[20px] font-[450]"
                value={answer}
                onChange={handleInputChange}
                onKeyDown={handleInputKeyDown}
            />

            <button
                className="w-[50px] h-[40px] rounded-[10px] cursor-pointer flex items-center justify-center
                    transition-colors duration-[80ms]
                    bg-teal-70 hover:bg-teal-65 text-white dark:text-gray-95"
                onClick={handleButtonClick}
            >
                <SendIcon/>
            </button>
        </div>
    )
}
