import { useContext, useState } from "react";
import { useNavigate } from "react-router";
import { encodeGameURL, type GameOptions } from "src/gameOptions";
import { GameStoreContext } from "../../hook";
import { RestartDialog } from "../RestartDialog";
import { FilterSection } from "./FilterSection";
import { GameModes } from "./GameModes";
import { MaxQuestions } from "./MaxQuestions";
import { FilterDialog } from "./filterDialog";

export function OptionsSection() {
    const useGameStore = useContext(GameStoreContext);
    const [newOptions, setNewOptions] = useState(useGameStore.getState().options);

    const [showFilterDialog, setShowFilterDialog] = useState(false);

    const [showRestartDialog, setShowRestartDialog] = useState(false);
    const handleConfirmRestart = () => {
        const url = encodeGameURL(newOptions);
        navigate(url);
    };
    const handleCancelRestart = () => {
        setNewOptions(useGameStore.getState().options);         // revert to the current options
    };
    const handleRestartDialogClose = () => {
        setShowRestartDialog(false);
        setShowFilterDialog(false);
    };

    const navigate = useNavigate();
    const changeOptions = (newOptions: GameOptions) => {
        setNewOptions(newOptions);

        const game = useGameStore.getState();
        if (game.api.numberGuessed > 0) {
            setShowRestartDialog(true);
        } else {
            setShowFilterDialog(false);
            const url = encodeGameURL(newOptions);      // only switch options immediately if the user hasn't guessed
            navigate(url);                              // a single question, otherwise show a dialog
        }
    };

    return (
        <div className="flex flex-col border-t border-gray-15 dark:border-gray-80 p-[30px]">
            <span className="text-gray-80 dark:text-gray-15 font-[550]">
                Opcje rozgrywki
            </span>

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
