import clsx from "clsx";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useLocation } from "react-router";
import { optionsFromURL } from "src/game2/options";
import { GameError } from "./GameError";
import { GameSkeleton } from "./GameSkeleton";
import { GameView } from "./GameView";
import { GameStoreContext } from "./hook";
import { useGameSwitcher } from "./useGameSwitcher";

/** Shows the appropriate game screen depending on URL search params.
 *  Displays an error if the search params are incorrect. */
export function Game() {
    const container = useRef<HTMLDivElement | null>(null);
    const [fullscreen, setFullscreen] = useState(false);
    const handleToggleFullscreen = useCallback(() => {
        setFullscreen((fullscreen) => !fullscreen);
    }, []);
    useEffect(() => {
        if (fullscreen) {
            container.current!.requestFullscreen();

            const handleFullscreenChange = () => {
                if (!document.fullscreenElement) {
                    setFullscreen(false);
                }
            };
            document.addEventListener("fullscreenchange", handleFullscreenChange);
            return () => document.removeEventListener("fullscreenchange", handleFullscreenChange);
        } else {
            if (document.fullscreenElement) {
                document.exitFullscreen();
            }
        }
    }, [fullscreen]);

    const { state, firstLoad, gameComponent, useGameStore, requestSwitch } = useGameSwitcher({
        onToggleFullscreen: handleToggleFullscreen,
    });
    const { hash } = useLocation();
    const newOptions = useMemo(() => optionsFromURL(hash), [hash]);
    useEffect(() => {
        requestSwitch(newOptions);
    }, [newOptions, requestSwitch]);

    return (
        <div
            ref={container}
            className={clsx("bg-white dark:bg-black flex-1 min-h-[600px] px-[10px] py-[20px]",
                (fullscreen) ? "md:py-[20px]" : "lg:px-[80px]")}
        >
            {(state === "invalidOptions") ? (
                <GameError/>
            ) : (
                (firstLoad) ? (
                    <GameSkeleton/>
                ) : (
                    <GameStoreContext value={useGameStore!}>
                        <GameView gameComponent={gameComponent!}/>
                    </GameStoreContext>
                )
            )}
        </div>
    );
}
