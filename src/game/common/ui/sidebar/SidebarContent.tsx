import { useRef, useState } from "react";
import { FilterDialog, Filters, type GameOptions, type GameType, type UnitFilters } from "src/gameOptions";
import { PauseIcon, PlayIcon, RestartIcon } from "src/ui";
import type { GameState } from "../../state";
import { ConfirmRestartDialog } from "./ConfirmRestartDialog";
import { ControlButton } from "./ControlButton";
import { OptionsPanel } from "./OptionsPanel";
import { OtherGameTypesProps } from "./OtherGameTypes";
import { Timer } from "./Timer";

export interface SidebarContentProps {
    gameState: GameState;
    calculateTime: () => number;
    onTogglePause: () => void;
    options: GameOptions;
    /** When set to true, the user will be asked before the game is restarted due to changes to game options. */
    restartNeedsConfirmation: boolean;
    /** Called when the game should be restarted due to options having been modified by the player. */
    onGameRestart: (newOptions: GameOptions) => void;
}

export function SidebarContent({
    gameState,
    calculateTime,
    onTogglePause,
    options,
    restartNeedsConfirmation,
    onGameRestart,
}: SidebarContentProps) {
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

    // restart dialog

    const handleConfirmRestart = () => {
        onGameRestart(newOptions.current!);
        newOptions.current = null;
        setShowConfirmDialog(false);
        setShowFilterDialog(false);
    };

    const handleCancelRestart = () => {
        setShowConfirmDialog(false);
    };

    // restart button

    const handleRestartClick = () => {
        queueRestart(options);
    };

    // filter dialog

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

    // game type picker

    const handleGameTypeChange = (newGameType: GameType) => {
        queueRestart({
            ...options,
            gameType: newGameType,
        });
    };

    return (<>
        <div className="flex items-center h-[77px] pl-[30px] pr-[22px] gap-[2px]">
            <Timer
                gameState={gameState}
                calculateTime={calculateTime}
            />

            <ControlButton
                icon={RestartIcon}
                className="ml-auto"
                onClick={handleRestartClick}
            />

            <ControlButton
                icon={(gameState === "paused") ? PlayIcon : PauseIcon}
                onClick={onTogglePause}
            />
        </div>

        <OptionsPanel>
            <OtherGameTypesProps
                options={options}
                onGameTypeChange={handleGameTypeChange}
            />

            <Filters
                filters={options.filters}
                onExpand={handleExpandFilters}
                className="mb-[3px]"
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
    </>);
}
