import { useEffect, useMemo } from "react";
import { useSearchParams } from "react-router";
import { decodeGameURL } from "src/gameOptions";
import { GameError } from "./GameError";
import { GameSkeleton } from "./GameSkeleton";
import { GameView } from "./GameView";
import { GameStoreContext } from "./hook";
import { useGameSwitcher } from "./useGameSwitcher";

/** Shows the appropriate game screen depending on URL search params.
 *  Displays an error if the search params are incorrect. */
export function Game() {
    const { state, firstLoad, gameComponent, useGameStore, requestSwitch } = useGameSwitcher();
    const [searchParams] = useSearchParams();
    const newOptions = useMemo(() => decodeGameURL(searchParams), [searchParams]);
    useEffect(() => {
        requestSwitch(newOptions);
    }, [newOptions, requestSwitch]);

    return (
        <div className="bg-white dark:bg-black flex-1 min-h-[600px] md:px-[20px] lg:px-[100px] md:pb-[25px]">
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
