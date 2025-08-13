import clsx from "clsx";
import { useEffect, useRef, useState, type KeyboardEvent as ReactKeyboardEvent } from "react";
import { InfoIcon, SendIcon } from "src/ui";

export interface PromptInputProps {
    placeholder?: string;
    answered?: number;
    total?: number;
    textTransform?: "uppercase" | "capitalize";
    className?: string;
    onGuess: (answer: string) => "correct" | "alreadyGuessed" | "wrong";
}

export function PromptInput({
    placeholder,
    answered,
    total,
    textTransform,
    className,
    onGuess,
}: PromptInputProps) {
    const [answer, setAnswer] = useState("");

    const [result, setResult] = useState<"correct" | "alreadyGuessed" | "wrong" | null>(null);
    const [animState, setAnimState] = useState<"correctAnim" | "wrongAnim" | null>(null);
    useEffect(() => {
        if (animState) {
            let animTimeout: number | null = setTimeout(() => {
                animTimeout = null;
                setAnimState(null);
            }, 450);

            return () => {
                if (animTimeout) {
                    clearTimeout(animTimeout);
                }
            };
        }
    }, [animState]);

    const input = useRef<HTMLInputElement>(null);
    useEffect(() => {
        input.current!.focus();         // focus input when component mounted
    }, []);

    const handleInputChange = () => {
        setAnswer(input.current!.value);
    };

    const guess = () => {
        if (answer !== "") {
            const result = onGuess(answer);
            setResult(result);
            if (result === "correct") {
                setAnimState("correctAnim");
            } else if (result === "wrong") {
                setAnimState("wrongAnim");
            }
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
            animState === "wrongAnim" && "animate-shake",
            animState === "correctAnim" && "animate-correct dark:animate-correct-dark",
            className)}>
            <input
                ref={input}
                type="text"
                placeholder={placeholder}
                className={clsx("size-full pl-[20px] pr-[70px] rounded-[20px] font-[450] focus-ring",
                    answer.length > 0 && textTransform)}        // don't transform text when placeholder shown
                value={answer}
                onChange={handleInputChange}
                onKeyDown={handleInputKeyDown}
            />

            {answered !== undefined && total !== undefined && total > 1 && (
                <span className="absolute text-[14px] bottom-[9px] right-[68px] text-gray-60 tracking-[-0.01em]">
                    {answered}/{total}
                </span>
            )}

            <button
                className="absolute right-[9px] top-[9px] w-[50px] h-[40px] rounded-[10px] cursor-pointer
                    flex items-center justify-center focus-ring
                    transition-colors duration-[80ms] bg-teal-70 hover:bg-teal-65 text-white dark:text-gray-95"
                onClick={handleButtonClick}
            >
                <SendIcon/>
            </button>

            {result === "alreadyGuessed" && (
                <div className="absolute left-[15px] top-[70px] text-[14px] text-gray-80 flex items-center gap-[4px]">
                    <InfoIcon className="size-[12px]"/>
                    <span>
                        Już zgadłeś tą odpowiedź.
                    </span>
                </div>
            )}
        </div>
    )
}
