import { lazy, useEffect, useMemo, useRef, useState } from "react";
import { useSearchParams } from "react-router";
import { decodeGameURL, validateGameOptions, type GameOptions } from "src/gameOptions";
import { ChoiceGameStoreContext, createChoiceGameStore, type ChoiceGameStoreHook } from "./choice";
import { GameError } from "./common";
import { createPromptGameStore, PromptGameStoreContext, type PromptGameStoreHook } from "./prompt";
import { createTypingGameStore, TypingGameStoreContext, type TypingGameStoreHook } from "./typing";

const ChoiceGame = lazy(() => import("./choice"));
const PromptGame = lazy(() => import("./prompt"));
const TypingGame = lazy(() => import("./typing"));

export function Game() {
    const [searchParams] = useSearchParams();
    const newOptions = useMemo(() => decodeGameURL(searchParams), [searchParams]);

    const [isError, setIsError] = useState(false);

    const hook = useRef<ChoiceGameStoreHook | PromptGameStoreHook | TypingGameStoreHook | null>(null);
    const [options, setOptions] = useState<GameOptions | null>(null);

    useEffect(() => {
        if (newOptions && validateGameOptions(newOptions)) {
            const optionsBeforeAwait = newOptions;
            (async () => {
                const newHook = await gameHookFromOptions(newOptions);
                // check if the game options changed before the async function was ran
                if (newOptions === optionsBeforeAwait) {
                    hook.current = newHook;
                    setOptions(newOptions);
                }
            })();
        } else {
            setIsError(true);
        }
    }, [newOptions]);

    if (isError) {
        return (
            <GameError
                details="Podany adres gry jest nieprawidłowy. Upewnij się, że adres jest poprawny,
                    albo spróbuj wybrać inny tryb gry."
            />
        );
    }

    if (options) {
        if (options.gameType === "choiceGame") {
            return (
                <ChoiceGameStoreContext value={hook.current as ChoiceGameStoreHook}>
                    <ChoiceGame/>
                </ChoiceGameStoreContext>
            );
        } else if (options.gameType === "promptGame") {
            return (
                <PromptGameStoreContext value={hook.current as PromptGameStoreHook}>
                    <PromptGame/>
                </PromptGameStoreContext>
            );
        } else if (options.gameType === "typingGame") {
            return (
                <TypingGameStoreContext value={hook.current as TypingGameStoreHook}>
                    <TypingGame/>
                </TypingGameStoreContext>
            );
        }
    }
    return null;
}

function gameHookFromOptions(
    options: GameOptions
): Promise<ChoiceGameStoreHook | PromptGameStoreHook | TypingGameStoreHook> {
    if (options.gameType === "choiceGame") {
        return createChoiceGameStore(options);
    } else if (options.gameType === "promptGame") {
        return createPromptGameStore(options);
    } else if (options.gameType === "typingGame") {
        return createTypingGameStore(options);
    }
    throw new Error("No matching hook for this game type.");
}
