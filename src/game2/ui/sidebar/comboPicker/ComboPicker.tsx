import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router";
import {
    guessables,
    optionsToURL,
    unitTypes,
    validateGameOptions,
    type GameOptions,
    type Guessable,
    type UnitType,
} from "src/game2/options";
import { CarIcon, COAIcon, Dropdown, DropdownItem, FlagIcon, PlaceNameIcon, TargetIcon } from "src/ui";
import { GameStoreContext } from "../../hook";
import { RestartDialog } from "../RestartDialog";
import { SwapButton } from "./SwapButton";

export function ComboPicker() {
    const useGameStore = useContext(GameStoreContext);
    const [newOptions, setNewOptions] = useState(useGameStore.getState().options);

    const options = useGameStore((game) => game.options);
    useEffect(() => {
        setNewOptions(options);     // Update selected options when current game options change.
    }, [options]);

    const [showRestartDialog, setShowRestartDialog] = useState(false);
    const handleConfirmRestart = () => {
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
        // Allow incorrect game options to be set, but don't navigate to their corresponding URL.
        setNewOptions(newOptions);

        if (validateGameOptions(newOptions)) {
            const game = useGameStore.getState();
            if (game.api.numberGuessed > 0) {
                setShowRestartDialog(true);
            } else {
                const url = optionsToURL(newOptions);   // only switch options immediately if the user hasn't guessed
                navigate(url);                          // a single question, otherwise show a dialog
            }
        }
    };

    const setGuessValue = (newValue: string) => {
        if (!guessables.includes(newValue as Guessable)) {
            throw new TypeError("New value doesn't match expected type.");
        }
        changeOptions({
            ...newOptions,
            guess: newValue as Guessable,
        });
    };

    const setGuessFromValue = (newValue: string) => {
        if (!guessables.includes(newValue as Guessable)) {
            throw new TypeError("New value doesn't match expected type.");
        }
        changeOptions({
            ...newOptions,
            guessFrom: newValue as Guessable,
        });
    };

    const setUnitTypeValue = (newValue: string) => {
        if (!unitTypes.includes(newValue as UnitType)) {
            throw new TypeError("New value doesn't match expected type.");
        }
        changeOptions({
            ...newOptions,
            unitType: newValue as UnitType,
        });
    };

    const handleSwapClick = () => {
        changeOptions({
            ...newOptions,
            guessFrom: newOptions.guess,
            guess: newOptions.guessFrom,
        });
    };

    return (
        <div className="flex flex-col px-[28px] py-[10px] gap-[4px]">
            <p className="text-[14px] text-gray-60 dark:text-gray-45 font-[450]">
                Zgadnij
            </p>
            <div className="flex mx-[-3px] gap-[5px]">
                <Dropdown value={newOptions.guess} onChange={setGuessValue} className="flex-1 min-w-0">
                    <DropdownItem value="name" icon={PlaceNameIcon} label="nazwę"/>
                    <DropdownItem value="capital" icon={TargetIcon} label="stolicę"/>
                    <DropdownItem value="plate" icon={CarIcon} label="rejestrację"/>
                    <DropdownItem value="flag" icon={FlagIcon} label="flagę"/>
                    <DropdownItem value="coa" icon={COAIcon} label="herb"/>
                    <DropdownItem value="shape" label="kształt"/>
                </Dropdown>

                <Dropdown value={newOptions.unitType} onChange={setUnitTypeValue} className="w-[140px]">
                    <DropdownItem value="county" label="powiatu"/>
                    <DropdownItem value="voivodeship" label="województwa"/>
                </Dropdown>
            </div>

            <div className="relative">
                <p className="text-[14px] text-gray-60 dark:text-gray-45 font-[450] mt-[2px]">
                    na podstawie jego
                </p>

                <SwapButton
                    className="absolute top-[-3px] right-0"
                    onClick={handleSwapClick}
                />
            </div>
            <Dropdown value={newOptions.guessFrom} onChange={setGuessFromValue} className="mx-[-3px]">
                <DropdownItem value="name" icon={PlaceNameIcon} label="nazwy"/>
                <DropdownItem value="capital" icon={TargetIcon} label="stolicy"/>
                <DropdownItem value="plate" icon={CarIcon} label="rejestracji"/>
                <DropdownItem value="flag" icon={FlagIcon} label="flagi"/>
                <DropdownItem value="coa" icon={COAIcon} label="herbu"/>
                <DropdownItem value="shape" label="kształtu"/>
            </Dropdown>

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
