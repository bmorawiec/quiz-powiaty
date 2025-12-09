import { useEffect, useMemo } from "react";
import { useSearchParams } from "react-router";
import { decodeGameURL } from "src/gameOptions";
import { GameError } from "./GameError";
import { GameSkeleton } from "./GameSkeleton";
import { GameView } from "./GameView";
import { GameStoreContext } from "./hook";
import { useGameSwitcher } from "./useGameSwitcher";

export function Game() {
    const { state, gameComponent, useGameStore, requestSwitch } = useGameSwitcher();
    const [searchParams] = useSearchParams();
    const newOptions = useMemo(() => decodeGameURL(searchParams), [searchParams]);
    useEffect(() => {
        requestSwitch(newOptions);
    }, [newOptions, requestSwitch]);

    return (
        <div className="bg-white dark:bg-black flex-1 min-h-[600px]">
            {(state === "ready") ? (
                <GameStoreContext value={useGameStore!}>
                    <GameView gameComponent={gameComponent!}/>
                </GameStoreContext>
            ) : (state === "invalidOptions") ? (
                <GameError/>
            ) : (
                <GameSkeleton/>
            )}
        </div>
    );
}
