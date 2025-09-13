import { lazy, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useNavigate, useSearchParams } from "react-router";
import { decodeGameURL, encodeGameURL, validateGameOptions, type GameOptions } from "src/gameOptions";
import { ChoiceGameStoreContext, createChoiceGameStore, type ChoiceGameStoreHook } from "./choice";
import { GameError, type GameProps } from "./common";
import { createPromptGameStore, PromptGameStoreContext, type PromptGameStoreHook } from "./prompt";
import { createTypingGameStore, TypingGameStoreContext, type TypingGameStoreHook } from "./typing";
import clsx from "clsx";

const ChoiceGame = lazy(() => import("./choice"));
const PromptGame = lazy(() => import("./prompt"));
const TypingGame = lazy(() => import("./typing"));

export function Game() {
    const [searchParams] = useSearchParams();
    const newOptions = useMemo(() => decodeGameURL(searchParams), [searchParams]);

    const gameId = useRef(0);

    const [isError, setIsError] = useState(false);

    const [hook, setHook] = useState<ChoiceGameStoreHook | PromptGameStoreHook | TypingGameStoreHook | null>(null);
    const [options, setOptions] = useState<GameOptions | null>(null);

    const restartGame = useCallback(async () => {
        if (newOptions && validateGameOptions(newOptions)) {
            const thisGameId = gameId.current + 1;
            gameId.current = thisGameId;

            const newHook = await gameHookFromOptions(newOptions);

            // check if another game was started during the await
            // if so, then don't start this game
            if (gameId.current === thisGameId) {
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

    const container = useRef<HTMLDivElement | null>(null);
    const [fullscreen, setFullscreen] = useState(false);

    const handleToggleFullscreen = () => {
        setFullscreen(!fullscreen);
    };

    useEffect(() => {
        if (fullscreen) {
            container.current!.requestFullscreen();
        } else {
            if (document.fullscreenElement) {
                document.exitFullscreen();
            }
        }
    }, [fullscreen]);

    useEffect(() => {
        const elem = container.current!;

        const handleFullscreenChange = () => {
            // detect fullscreen mode exit triggered in a way other than the fullscreen button
            // (for example via the esc key)
            if (!document.fullscreenElement) {
                setFullscreen(false);
            }
        };

        elem.addEventListener("fullscreenchange", handleFullscreenChange);
        return () => elem.removeEventListener("fullscreenchange", handleFullscreenChange);
    }, []);

    const gameProps: GameProps = {
        onRestart: handleRestart,
        onOptionsChange: handleOptionsChange,
        fullscreen,
        onToggleFullscreen: handleToggleFullscreen,
    };
    return (
        <div
            ref={container}
            className={clsx("bg-white dark:bg-black flex-1 flex gap-[16px] sm:px-[20px] min-h-[600px]",
                (fullscreen) ? "py-[20px]" : "lg:px-[100px] sm:pb-[38px]")}
        >
            {(isError) ? (
                <GameError
                    title="Podany adres gry jest nieprawidłowy"
                    details="Spróbuj ponownie przepisać adres lub wybierz inny tryb gry."
                />
            ) : (
                options && (    // options is null when game is loading
                    (options.gameType === "choiceGame") ? (
                        <ChoiceGameStoreContext value={hook as ChoiceGameStoreHook}>
                            <ChoiceGame {...gameProps}/>
                        </ChoiceGameStoreContext>
                    ) : (options.gameType === "promptGame") ? (
                        <PromptGameStoreContext value={hook as PromptGameStoreHook}>
                            <PromptGame {...gameProps}/>
                        </PromptGameStoreContext>
                    ) : (options.gameType === "typingGame") ? (
                        <TypingGameStoreContext value={hook as TypingGameStoreHook}>
                            <TypingGame {...gameProps}/>
                        </TypingGameStoreContext>

                    ) : null
                )
            )}
        </div>
    );
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
