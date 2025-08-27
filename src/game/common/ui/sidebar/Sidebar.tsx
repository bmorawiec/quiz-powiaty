import { useRef, useState } from "react";
import { FilterDialog, Filters, type GameOptions, type UnitFilters } from "src/gameOptions";
import { PauseIcon, PlayIcon, RestartIcon } from "src/ui";
import { ControlButton } from "./ControlButton";
import { Timer } from "./Timer";
import { OptionsPanel } from "./OptionsPanel";
import { ConfirmRestartDialog } from "./ConfirmRestartDialog";

export interface SidebarProps {
    paused: boolean;
    calculateTime: () => number;
    onTogglePause: () => void;
    options: GameOptions;
    /** When set to true, the user will be asked before the game is restarted due to changes to game options. */
    restartNeedsConfirmation: boolean;
    /** Called when the game should be restarted due to options having been modified by the player. */
    onGameRestart: (newOptions: GameOptions) => void;
}

export function Sidebar({
    paused,
    calculateTime,
    onTogglePause,
    options,
    restartNeedsConfirmation,
    onGameRestart,
}: SidebarProps) {
    const [showConfirmDialog, setShowConfirmDialog] = useState(false);
    const newOptions = useRef<GameOptions | null>(null);

    const [showFilterDialog, setShowFilterDialog] = useState(false);

    const queueRestart = (options: GameOptions) => {
        if (restartNeedsConfirmation) {
            newOptions.current = options;
            setShowConfirmDialog(true);
        } else {
            onGameRestart(options);
        }
    };

    const handleConfirmRestart = () => {
        onGameRestart(newOptions.current!);
        newOptions.current = null;
        setShowConfirmDialog(false);
        setShowFilterDialog(false);
    };

    const handleCancelRestart = () => {
        setShowConfirmDialog(false);
    };

    const handleRestartClick = () => {
        queueRestart(options);
    };

    const handleExpandFilters = () => {
        setShowFilterDialog(true);
    };

    const handleApplyFilters = (newFilters: UnitFilters) => {
        queueRestart({
            ...options,
            filters: newFilters,
        });
        if (!restartNeedsConfirmation) {
            setShowFilterDialog(false);
        }
    };

    const handleCancelFilters = () => {
        setShowFilterDialog(false);
    };

    return (
        <div className="bg-white dark:bg-gray-95 w-[400px] rounded-[20px] flex flex-col shadow-sm shadow-black/10
            overflow-hidden">
            <div className="flex items-center h-[77px] pl-[30px] pr-[22px] gap-[2px]">
                <Timer
                    paused={paused}
                    calculateTime={calculateTime}
                />

                <ControlButton
                    icon={RestartIcon}
                    className="ml-auto"
                    onClick={handleRestartClick}
                />

                <ControlButton
                    icon={(paused) ? PlayIcon : PauseIcon}
                    onClick={onTogglePause}
                />
            </div>

            <OptionsPanel>
                <Filters
                    filters={options.filters}
                    onExpand={handleExpandFilters}
                />
            </OptionsPanel>

            {showFilterDialog && (
                <FilterDialog
                    filters={options.filters}
                    onApply={handleApplyFilters}
                    onCancel={handleCancelFilters}
                />
            )}

            {showConfirmDialog && (
                <ConfirmRestartDialog
                    onConfirm={handleConfirmRestart}
                    onCancel={handleCancelRestart}
                />
            )}
        </div>
    );
}
