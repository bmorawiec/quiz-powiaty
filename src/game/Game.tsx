import { lazy, useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate, useSearchParams } from "react-router";
import { decodeGameURL, encodeGameURL, validateGameOptions, type GameOptions } from "src/gameOptions";
import { ChoiceGameStoreContext, createChoiceGameStore, type ChoiceGameStoreHook } from "./choice";
import { GameError, type GameProps } from "./common";
import { createPromptGameStore, PromptGameStoreContext, type PromptGameStoreHook } from "./prompt";
import { createTypingGameStore, TypingGameStoreContext, type TypingGameStoreHook } from "./typing";

const ChoiceGame = lazy(() => import("./choice"));
const PromptGame = lazy(() => import("./prompt"));
const TypingGame = lazy(() => import("./typing"));

export function Game() {
    const [searchParams] = useSearchParams();
    const newOptions = useMemo(() => decodeGameURL(searchParams), [searchParams]);

    const [isError, setIsError] = useState(false);

    const [hook, setHook] = useState<ChoiceGameStoreHook | PromptGameStoreHook | TypingGameStoreHook | null>(null);
    const [options, setOptions] = useState<GameOptions | null>(null);

    const restartGame = useCallback(async () => {
        if (newOptions && validateGameOptions(newOptions)) {
            const optionsBeforeAwait = newOptions;
            const newHook = await gameHookFromOptions(newOptions);
            // check if the game options changed before the async function was ran
            if (newOptions === optionsBeforeAwait) {
                setHook(() => newHook);         // passing in newHook directly would cause it to be called
                setOptions(newOptions);
            }
        } else {
            setIsError(true);
        }
    }, [newOptions]);

    useEffect(() => {
        restartGame();
    }, [restartGame]);

    const handleRestart = () => {
        restartGame();
    };

    const navigate = useNavigate();
    const handleOptionsChange = (newOptions: GameOptions) => {
        navigate(encodeGameURL(newOptions));
    };

    if (isError) {
        return (
            <GameError
                details="Podany adres gry jest nieprawidłowy. Upewnij się, że adres jest poprawny,
                    albo spróbuj wybrać inny tryb gry."
            />
        );
    }

    if (options) {
        const gameProps: GameProps = {
            onRestart: handleRestart,
            onOptionsChange: handleOptionsChange,
        };
        if (options.gameType === "choiceGame") {
            return (
                <ChoiceGameStoreContext value={hook as ChoiceGameStoreHook}>
                    <ChoiceGame {...gameProps}/>
                </ChoiceGameStoreContext>
            );
        } else if (options.gameType === "promptGame") {
            return (
                <PromptGameStoreContext value={hook as PromptGameStoreHook}>
                    <PromptGame {...gameProps}/>
                </PromptGameStoreContext>
            );
        } else if (options.gameType === "typingGame") {
            return (
                <TypingGameStoreContext value={hook as TypingGameStoreHook}>
                    <TypingGame {...gameProps}/>
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
