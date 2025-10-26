import {
    useCallback,
    useEffect,
    useMemo,
    useRef,
    useState,
    type ComponentType,
    type Context,
    type ReactNode,
} from "react";
import { useNavigate, useSearchParams } from "react-router";
import { decodeGameURL, encodeGameURL, validateGameOptions, type GameOptions } from "src/gameOptions";
import { ulid } from "ulid";
import type { StoreApi, UseBoundStore } from "zustand";
import { type GameProps } from "./common";
import { GameError } from "./GameError";
import { GameSkeleton } from "./GameSkeleton";

export function Game() {
    const [searchParams] = useSearchParams();
    const newOptions = useMemo(() => decodeGameURL(searchParams), [searchParams]);

    const gameId = useRef<string | null>(null);

    const [isError, setIsError] = useState(false);

    const [isLoading, setIsLoading] = useState(false);
    const [gameRenderFn, setGameRenderFn] = useState<((props: GameProps) => ReactNode) | null>(null);
    const restartGame = useCallback(async () => {
        if (newOptions && validateGameOptions(newOptions)) {
            const thisGameId = ulid();
            gameId.current = thisGameId;

            setIsLoading(true);
            const newRenderFn = await gameRenderFnFromOptions(newOptions);

            // check if another game was started during the await
            // if so, then don't start this game
            if (gameId.current === thisGameId) {
                setIsLoading(false);
                setGameRenderFn(() => newRenderFn);     // passing in newRenderFn directly would cause it to be called
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
        isLoading,
    };
    return (
        <div
            ref={container}
            className="bg-white dark:bg-black flex-1 min-h-[600px]"
        >
            {(isError) ? (
                <GameError
                    title="Podany adres gry jest nieprawidłowy"
                    details="Spróbuj ponownie przepisać adres lub wybierz inny tryb gry."
                />
            ) : (gameRenderFn) ? (
                gameRenderFn(gameProps)
            ) : (isLoading && <GameSkeleton/>)}
        </div>
    );
}

async function gameRenderFnFromOptions(options: GameOptions): Promise<(props: GameProps) => ReactNode> {
    if (options.gameType === "choiceGame") {
        const { createChoiceGameStore, ChoiceGameStoreContext, ChoiceGame } = await import("./choice");
        return createRenderFn(createChoiceGameStore, ChoiceGameStoreContext, ChoiceGame, options);
    } else if (options.gameType === "dndGame") {
        const { createDnDGameStore, DnDGameStoreContext, DnDGame } = await import("./dnd");
        return createRenderFn(createDnDGameStore, DnDGameStoreContext, DnDGame, options);
    } else if (options.gameType === "mapGame") {
        const { createMapGameStore, MapGameStoreContext, MapGame } = await import("./map");
        return createRenderFn(createMapGameStore, MapGameStoreContext, MapGame, options);
    } else if (options.gameType === "promptGame") {
        const { createPromptGameStore, PromptGameStoreContext, PromptGame } = await import("./prompt");
        return createRenderFn(createPromptGameStore, PromptGameStoreContext, PromptGame, options);
    } else if (options.gameType === "typingGame") {
        const { createTypingGameStore, TypingGameStoreContext, TypingGame } = await import("./typing");
        return createRenderFn(createTypingGameStore, TypingGameStoreContext, TypingGame, options);
    }
    throw new Error("No match for this game type.");
}

async function createRenderFn<TStore>(
    createThisGameStore: (options: GameOptions) => Promise<UseBoundStore<StoreApi<TStore>>>,
    ThisGameStoreContext: Context<UseBoundStore<StoreApi<TStore>>>,
    ThisGame: ComponentType<GameProps>,
    options: GameOptions,
): Promise<(props: GameProps) => ReactNode> {
    const hook = await createThisGameStore(options);
    return (props: GameProps) => (
        <ThisGameStoreContext value={hook}>
            <ThisGame {...props}/>
        </ThisGameStoreContext>
    );
}
