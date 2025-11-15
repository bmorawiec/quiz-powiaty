import { useCallback, useEffect, useMemo, useRef, useState, type ComponentType } from "react";
import { useNavigate, useSearchParams } from "react-router";
import { decodeGameURL, encodeGameURL, validateGameOptions, type GameOptions } from "src/gameOptions";
import { ulid } from "ulid";
import { GameStoreContext, type GameProps, type GameStoreHook } from "./common";
import { GameError } from "./GameError";
import { GameLayout2 } from "./gameLayout2";
import { GameSkeleton } from "./GameSkeleton";

export interface GamePackage {
    options: GameOptions;
    hook: GameStoreHook;
    component: ComponentType<GameProps>;
}

export function Game() {
    const [searchParams] = useSearchParams();
    const newOptions = useMemo(() => decodeGameURL(searchParams), [searchParams]);

    const gameId = useRef<string | null>(null);

    const [isError, setIsError] = useState(false);

    const [isLoading, setIsLoading] = useState(false);
    const [gamePackage, setGamePackage] = useState<GamePackage | null>(null);
    const restartGame = useCallback(async () => {
        if (newOptions && validateGameOptions(newOptions)) {
            const thisGameId = ulid();
            gameId.current = thisGameId;

            setIsLoading(true);
            const newGamePackage = await gamePackageFromOptions(newOptions);

            // check if another game was started during the await
            // if so, then don't start this game
            if (gameId.current === thisGameId) {
                setIsLoading(false);
                setGamePackage(newGamePackage);
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
            ) : (gamePackage) ? (
                <GameStoreContext value={gamePackage.hook}>
                    <GameLayout2
                        gameScreen={gamePackage.component}
                        onRestart={handleRestart}
                        fullscreen={fullscreen}
                        onToggleFullscreen={handleToggleFullscreen}
                        onOptionsChange={handleOptionsChange}
                    />
                </GameStoreContext>
            ) : (isLoading && <GameSkeleton/>)}
        </div>
    );
}

async function gamePackageFromOptions(options: GameOptions): Promise<GamePackage> {
    if (options.gameType === "choiceGame") {
        const { createChoiceGameStore, ChoiceGame } = await import("./choice");
        return createGamePackage(options, createChoiceGameStore, ChoiceGame);
    } else if (options.gameType === "dndGame") {
        const { createDnDGameStore, DnDGame } = await import("./dnd");
        return createGamePackage(options, createDnDGameStore, DnDGame);
    } else if (options.gameType === "mapGame") {
        const { createMapGameStore, MapGame } = await import("./map");
        return createGamePackage(options, createMapGameStore, MapGame);
    } else if (options.gameType === "promptGame") {
        const { createPromptGameStore, PromptGame } = await import("./prompt");
        return createGamePackage(options, createPromptGameStore, PromptGame);
    } else if (options.gameType === "typingGame") {
        const { createTypingGameStore, TypingGame } = await import("./typing");
        return createGamePackage(options, createTypingGameStore, TypingGame);
    }
    throw new Error("No match for this game type.");
}

async function createGamePackage(
    options: GameOptions,
    createThisGameStore: (options: GameOptions) => Promise<GameStoreHook>,
    component: ComponentType<GameProps>
): Promise<GamePackage> {
    const hook = await createThisGameStore(options);
    return {
        options,
        hook,
        component,
    };
}
