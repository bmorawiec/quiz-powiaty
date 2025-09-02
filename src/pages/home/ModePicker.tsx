import clsx from "clsx";
import { useState } from "react";
import { useNavigate } from "react-router";
import type { Guessable, UnitType } from "src/data/common";
import { type GameOptions, type GameType, encodeGameURL, validateGameOptions } from "src/gameOptions";
import {
    CarIcon,
    COAIcon,
    FlagIcon,
    LargeButton,
    LargeDropdown,
    LargeLink,
    LocationIcon,
    PlaceNameIcon,
    SmallArrowRightIcon,
    TargetIcon,
} from "src/ui";
import { useAnimation } from "src/utils/useAnimation";

export function ModePicker() {
    const navigate = useNavigate();

    const [guess, setGuess] = useState<Guessable>("map");
    const [guessFrom, setGuessFrom] = useState<Guessable>("name");
    const [unitType, setUnitType] = useState<UnitType>("county");

    const [isInvalidAnim, startInvalidAnim] = useAnimation(450);
    const handlePlayClick = () => {
        const gameType: GameType = (guess === "map") ? "mapGame" : "choiceGame";

        const options: GameOptions = {
            gameType,
            unitType,
            guessFrom,
            guess,
            filters: {
                countyTypes: [],
                voivodeships: [],
            },
        };
        if (validateGameOptions(options)) {
            navigate(encodeGameURL(options));
        } else {
            startInvalidAnim();
        }
    };

    return (
        <div className="absolute left-[20px] lg:left-[100px] top-[20px] bottom-[20px] max-xs:right-[20px] xs:w-[480px]
            p-[30px] bg-white dark:bg-black rounded-[20px] shadow-sm shadow-black/10 flex flex-col gap-[12px]">

            <p className="text-[18px] tracking-[0.01em]">
                Zgadnij...
            </p>

            <div className="flex gap-[10px] max-xs:flex-col">
                <LargeDropdown
                    items={[
                        { value: "name", icon: PlaceNameIcon, label: "nazwę" },
                        { value: "capital", icon: TargetIcon, label: "stolicę" },
                        { value: "plate", icon: CarIcon, label: "rejestrację" },
                        { value: "flag", icon: FlagIcon, label: "flagę" },
                        { value: "coa", icon: COAIcon, label: "godło" },
                        { value: "map", icon: LocationIcon, label: "lokalizację na mapie" },
                    ]}
                    value={guess}
                    className="flex-1"
                    onChange={setGuess}
                />

                <LargeDropdown
                    items={[
                        { value: "county", label: "powiatu" },
                        { value: "voivodeship", label: "województwa" },
                    ]}
                    value={unitType}
                    className="xs:w-[160px]"
                    onChange={setUnitType}
                />
            </div>

            <p className="text-[18px] tracking-[0.01em]">
                na podstawie jego...
            </p>

            <LargeDropdown
                items={[
                    { value: "name", icon: PlaceNameIcon, label: "nazwy" },
                    { value: "capital", icon: TargetIcon, label: "stolicy" },
                    { value: "plate", icon: CarIcon, label: "rejestracji" },
                    { value: "flag", icon: FlagIcon, label: "flagi" },
                    { value: "coa", icon: COAIcon, label: "godła" },
                    { value: "map", icon: LocationIcon, label: "lokalizacji na mapie" },
                ]}
                value={guessFrom}
                onChange={setGuessFrom}
            />

            <LargeButton
                primary
                text="Zacznij grę"
                iconRight={SmallArrowRightIcon}
                className={clsx("mt-auto", isInvalidAnim && "animate-shake")}
                onClick={handlePlayClick}
            />

            <LargeLink
                short
                to="/gry"
                text="Wszystkie tryby gry"
            />
        </div>
    );
}
