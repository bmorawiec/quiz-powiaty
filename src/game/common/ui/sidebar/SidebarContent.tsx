import { useState } from "react";
import {
    FilterDialog,
    Filters,
    MaxQuestions,
    type GameOptions,
    type GameType,
    type UnitFilters,
} from "src/gameOptions";
import { ExitFullscreenIcon, FullscreenIcon, PauseIcon, PlayIcon, RestartIcon } from "src/ui";
import type { GameState } from "../../state";
import { ConfirmRestartDialog } from "./ConfirmRestartDialog";
import { ControlButton } from "./ControlButton";
import { OptionsPanel } from "./OptionsPanel";
import { OtherGameTypes } from "./OtherGameTypes";
import { Timer } from "./Timer";

export interface SidebarContentProps {
    gameState: GameState;
    calculateTime: () => number;
    onTogglePause: () => void;
    fullscreen: boolean;
    onToggleFullscreen: () => void;
    options: GameOptions;
    /** When set to true, the user will be asked before the game is restarted due to changes to game options. */
    restartNeedsConfirmation: () => boolean;
    /** Called when the restart button is clicked. */
    onGameRestart: () => void;
    /** Called when the game should be restarted due to options having been modified by the player. */
    onOptionsChange: (newOptions: GameOptions) => void;
}

export function SidebarContent({
    gameState,
    calculateTime,
    onTogglePause,
    fullscreen,
    onToggleFullscreen,
    options,
    restartNeedsConfirmation,
    onGameRestart,
    onOptionsChange,
}: SidebarContentProps) {
    const [showConfirmDialog, setShowConfirmDialog] = useState(false);
    const [newOptions, setNewOptions] = useState(options);

    const [showFilterDialog, setShowFilterDialog] = useState(false);

    const queueRestart = (newOptions: GameOptions) => {
        setNewOptions(newOptions);
        if (restartNeedsConfirmation()) {
            setShowConfirmDialog(true);
        } else {
            if (newOptions === options) {
                onGameRestart();
            } else {
                onOptionsChange(newOptions);
            }
            setShowFilterDialog(false);
        }
    };

    // restart dialog

    const handleConfirmRestart = () => {
        if (newOptions === options) {
            onGameRestart();
        } else {
            onOptionsChange(newOptions);
        }
        setShowConfirmDialog(false);
        setShowFilterDialog(false);
    };

    const handleCancelRestart = () => {
        setNewOptions(options);         // cancel player's changes to options
        setShowConfirmDialog(false);
    };

    // restart button

    const handleRestartClick = () => {
        queueRestart(options);
    };

    // max questions widget

    const handleMaxQuestionsChange = (newLimit: number | null) => {
        queueRestart({
            ...options,
            maxQuestions: newLimit,
        });
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
        <div className="flex items-center h-[77px] pl-[30px] pr-[22px] justify-between">
            <Timer
                gameState={gameState}
                calculateTime={calculateTime}
            />

            <div className="flex gap-[2px]">
                <ControlButton
                    icon={(fullscreen) ? ExitFullscreenIcon : FullscreenIcon}
                    onClick={onToggleFullscreen}
                />

                <ControlButton
                    icon={RestartIcon}
                    onClick={handleRestartClick}
                />

                <ControlButton
                    icon={(gameState === "paused") ? PlayIcon : PauseIcon}
                    onClick={onTogglePause}
                />
            </div>
        </div>

        <OptionsPanel>
            <OtherGameTypes
                options={newOptions}
                onGameTypeChange={handleGameTypeChange}
                className="mt-[-12px] mb-[12px]"
            />

            <MaxQuestions
                value={newOptions.maxQuestions}
                onChange={handleMaxQuestionsChange}
                className="mx-[30px] mb-[17px]"
            />

            <Filters
                filters={newOptions.filters}
                onExpand={handleExpandFilters}
                className="mx-[30px]"
            />
        </OptionsPanel>

        {showFilterDialog && (
            <FilterDialog
                filters={newOptions.filters}
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
