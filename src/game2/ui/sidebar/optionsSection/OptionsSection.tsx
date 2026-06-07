import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { optionsToURL, type GameOptions } from "src/game2/options";
import { GameStoreContext } from "../../hook";
import { RestartDialog } from "../RestartDialog";
import { FilterSection } from "./FilterSection";
import { GameModes } from "./GameModes";
import { MaxQuestions } from "./MaxQuestions";
import { FilterDialog } from "./filterDialog";

export function OptionsSection() {
    const useGameStore = useContext(GameStoreContext);
    const [newOptions, setNewOptions] = useState(useGameStore.getState().options);

    const options = useGameStore((game) => game.options);
    useEffect(() => {
        setNewOptions(options);     // Update options selected in dropdowns when current game options change.
    }, [options]);

    const [showFilterDialog, setShowFilterDialog] = useState(false);

    const [showRestartDialog, setShowRestartDialog] = useState(false);
    const handleConfirmRestart = () => {
        setShowFilterDialog(false);

        const url = optionsToURL(newOptions);
        navigate(url);
    };
    const handleCancelRestart = () => {
        setNewOptions(useGameStore.getState().options);         // revert to the current options
    };
    const handleRestartDialogClose = () => {
        setShowRestartDialog(false);
    };

    const navigate = useNavigate();
    const changeOptions = (newOptions: GameOptions) => {
        setNewOptions(newOptions);

        const game = useGameStore.getState();
        if (game.api.numberGuessed > 0) {
            setShowRestartDialog(true);
        } else {
            setShowFilterDialog(false);
            const url = optionsToURL(newOptions);       // only switch options immediately if the user hasn't guessed
            navigate(url);                              // a single question, otherwise show a dialog
        }
    };

    return (
        <div className="flex flex-col border-t border-gray-15 dark:border-gray-80 p-[30px] pt-[10px] mt-auto">
            <GameModes
                options={newOptions}
                onChange={changeOptions}
            />

            <MaxQuestions
                options={newOptions}
                onChange={changeOptions}
            />

            <FilterSection
                options={newOptions}
                onExpand={() => setShowFilterDialog(true)}
            />

            {showFilterDialog && (
                <FilterDialog
                    options={newOptions}
                    onChange={changeOptions}
                    onCancel={() => setShowFilterDialog(false)}
                />
            )}

            {showRestartDialog && (
                <RestartDialog
                    onConfirm={handleConfirmRestart}
                    onCancel={handleCancelRestart}
                    onClose={handleRestartDialogClose}
                />
            )}
        </div>
    );
}
