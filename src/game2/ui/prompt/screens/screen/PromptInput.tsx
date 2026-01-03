import clsx from "clsx";
import { useContext, useEffect, useMemo, useRef, useState, type KeyboardEvent as ReactKeyboardEvent } from "react";
import type { GameAPIOptions } from "src/game2/api";
import { InvalidGameOptionsError } from "src/gameOptions";
import { InfoIcon, SendIcon } from "src/ui";
import { PromptGameStoreContext } from "../../hook";
import { getTextTransform } from "./textTransform";

export interface PromptInputProps {
    /** The amount of correct answers that have already been provided by the player. */
    answered?: number;
    /** The number of correct answers that needs to be provided. */
    total?: number;
    /** Called when the player submits their answer.
     *  Expects a tuple containing the result of guess verification and optionally a hint for the player. */
    onGuess: (answer: string) => ["correct" | "alreadyGuessed" | "wrong", string | null];
}

/** Displays a text input with a send button.
 *  Keeps a history of the guesses made. They can be recalled by pressing the arrow up and down keys.
 *  Supports displaying hints. */
export function PromptInput({ answered, total, onGuess }: PromptInputProps) {
    const usePromptGameStore = useContext(PromptGameStoreContext);
    const apiOptions = usePromptGameStore((game) => game.api.options);
    const [placeholder, textTransform] = useMemo(() => [
        getInputPlaceholder(apiOptions),
        getTextTransform(apiOptions),
    ], [apiOptions]);

    const history = useRef<string[]>([]);       // stores previous answers
    const historyIndex = useRef(0);             // determines which element from the history is currently displayed

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

    const [hint, setHint] = useState<string | null>(null);

    const input = useRef<HTMLInputElement>(null);
    useEffect(() => {
        input.current!.focus();         // focus input when component mounted
    }, []);

    const handleInputChange = () => {
        setAnswer(input.current!.value);
    };

    const guess = () => {
        if (answer !== "") {
            const [result, hint] = onGuess(answer);
            setResult(result);
            if (result === "correct") {
                setAnimState("correctAnim");
                setHint(null);
            } else if (result === "wrong") {
                setAnimState("wrongAnim");
                setHint(hint);
            }
            history.current.push(answer);
            historyIndex.current = -1;
            setAnswer("");
        }
    };

    const handleInputKeyDown = (event: ReactKeyboardEvent) => {
        if (event.key === "Enter") {
            guess();
        } else if (event.key === "ArrowUp") {
            event.preventDefault();
            if (history.current.length > 0) {
                if (historyIndex.current === -1) {
                    historyIndex.current = history.current.length - 1;
                } else if (historyIndex.current > 0) {
                    historyIndex.current--;
                }
                setAnswer(history.current[historyIndex.current]);
            }
        } else if (event.key === "ArrowDown") {
            event.preventDefault();
            if (historyIndex.current !== -1) {
                if (historyIndex.current + 1 >= history.current.length) {
                    historyIndex.current = -1;
                    setAnswer("");
                } else {
                    if (historyIndex.current > -1) {
                        historyIndex.current++;
                    }
                    setAnswer(history.current[historyIndex.current]);
                }
            }
        }
    };

    const handleButtonClick = () => {
        guess();
    };

    return (
        <div className="relative w-full max-w-[700px]">
            <div className={clsx("relative h-[60px] mb-[50px] rounded-[20px]",
                "border border-gray-20 dark:border-gray-65 bg-white dark:bg-gray-95",
                animState === "wrongAnim" && "animate-shake",
                animState === "correctAnim" && "animate-correct dark:animate-correct-dark")}>
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
            </div>

            <div className="absolute left-[15px] top-[70px] text-[14px] text-gray-80 flex flex-col gap-[10px]">
                {(hint || result === "alreadyGuessed") && (
                    <div className="flex items-center gap-[4px]">
                        <InfoIcon className="size-[12px]"/>
                        {result === "alreadyGuessed" && (
                            <span>
                                Już zgadłeś tą odpowiedź.
                            </span>
                        )}
                        {hint && (
                            <span>
                                Podpowiedź: {hint}
                            </span>
                        )}
                    </div>
                )}
            </div>
        </div>
    )
}

function getInputPlaceholder(apiOptions: GameAPIOptions): string {
    if (apiOptions.guess === "name") {
        return "Wpisz nazwę...";
    } else if (apiOptions.guess === "capital") {
        return "Wpisz nazwę stolicy...";
    } else if (apiOptions.guess === "plate") {
        return "Wpisz rejestrację...";
    }
    throw new InvalidGameOptionsError();
}
