import { useContext, useState } from "react";
import {
    ExitFullscreenIcon,
    FullscreenIcon,
    HeartIcon,
    IconButton,
    PauseIcon,
    PlayIcon,
    RestartIcon,
    SidebarIcon,
} from "src/ui";
import { useIsFullscreen } from "src/utils/useIsFullscreen";
import { GameStoreContext } from "../../hook";
import { RestartDialog } from "../RestartDialog";
import { Result } from "./Result";
import { Timer } from "./Timer";

export interface ActionBarProps {
    onCollapse: () => void;
}

export function ActionBar({ onCollapse }: ActionBarProps) {
    const isFullscreen = useIsFullscreen();

    const useGameStore = useContext(GameStoreContext);

    const state = useGameStore((game) => game.api.state);
    const togglePause = useGameStore((game) => game.api.togglePause);
    const toggleFullscreen = useGameStore((game) => game.api.toggleFullscreen);
    const restart = useGameStore((game) => game.api.restart);

    const [showRestartDialog, setShowRestartDialog] = useState(false);
    const handleRestartClick = () => {
        const game = useGameStore.getState();
        if (game.api.numberGuessed > 0 && game.api.state !== "finished") {
            setShowRestartDialog(true);
        } else {
            restart();
        }
    };

    return (
        <div className="flex flex-col">
            <div className="pl-[30px] pr-[33px] pt-[31px] pb-[13px] flex justify-between">
                <IconButton
                    icon={SidebarIcon}
                    onClick={onCollapse}
                />
                <div className="flex gap-[23px]">
                    <IconButton
                        icon={HeartIcon}
                    />
                    <IconButton
                        icon={(isFullscreen) ? ExitFullscreenIcon : FullscreenIcon}
                        onClick={toggleFullscreen}
                    />
                    <IconButton
                        icon={RestartIcon}
                        onClick={handleRestartClick}
                    />
                    <IconButton
                        icon={(state === "paused") ? PlayIcon : PauseIcon}
                        onClick={togglePause}
                    />
                </div>
            </div>
            <div className="px-[25px] py-[15px] grid grid-cols-2 gap-y-[15px] font-[450] tracking-[0.02em] text-[14px]">
                <p className="text-gray-60">
                    Czas
                </p>
                <Timer/>

                <p className="text-gray-60">
                    Aktualny wynik
                </p>
                <Result/>
            </div>

            {showRestartDialog && (
                <RestartDialog
                    onConfirm={restart}
                    onClose={() => setShowRestartDialog(false)}
                />
            )}
        </div>
    );
}
