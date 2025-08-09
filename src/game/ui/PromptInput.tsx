import clsx from "clsx";
import { useEffect, useRef, useState, type KeyboardEvent as ReactKeyboardEvent } from "react";
import { SendIcon } from "src/ui/icons";

export interface PromptInputProps {
    placeholder?: string;
    state?: "correct" | "alreadyGuessed" | "wrong" | null;
    className?: string;
    onGuess?: (answer: string) => void;
    onClearState?: () => void;
}

export function PromptInput({ placeholder, state, className, onGuess, onClearState }: PromptInputProps) {
    const [answer, setAnswer] = useState("");

    const [animState, setAnimState] = useState<"correct" | "wrong" | "none">("none");
    useEffect(() => {
        let animTimeout: number | null = null;
        if (state === "wrong") {
            if (animTimeout) {
                clearTimeout(animTimeout);
            }
            setAnimState("wrong");
            animTimeout = setTimeout(() => {
                animTimeout = null;
                setAnimState("none");
                onClearState?.();
            }, 450);
        }

        return () => {
            if (animTimeout) {
                clearTimeout(animTimeout);
                animTimeout = null;
                setAnimState("none");
                onClearState?.();
            }
        };
    }, [state]);

    const input = useRef<HTMLInputElement>(null);
    useEffect(() => {
        input.current!.focus();         // focus input when component mounted
    }, []);

    const handleInputChange = () => {
        setAnswer(input.current!.value);
    };

    const guess = () => {
        if (answer !== "") {
            onGuess?.(answer);
            setAnswer("");
        }
    };

    const handleInputKeyDown = (event: ReactKeyboardEvent) => {
        if (event.key === "Enter") {
            guess();
        }
    };

    const handleButtonClick = () => {
        guess();
    };

    return (
        <div className={clsx("relative h-[60px] border border-gray-20 dark:border-gray-65 rounded-[20px]",
            "bg-white dark:bg-gray-95",
            animState === "wrong" && "animate-shake",
            className)}>
            <input
                ref={input}
                type="text"
                placeholder={placeholder}
                className="size-full pl-[20px] pr-[70px] rounded-[20px] font-[450]"
                value={answer}
                onChange={handleInputChange}
                onKeyDown={handleInputKeyDown}
            />

            <button
                className="absolute right-[9px] top-[9px] w-[50px] h-[40px] rounded-[10px] cursor-pointer
                    flex items-center justify-center
                    transition-colors duration-[80ms] bg-teal-70 hover:bg-teal-65 text-white dark:text-gray-95"
                onClick={handleButtonClick}
            >
                <SendIcon/>
            </button>
        </div>
    )
}
