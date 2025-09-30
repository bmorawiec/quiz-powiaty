import clsx from "clsx";
import { useMemo, useState } from "react";
import { useNavigate } from "react-router";
import { guessables, unitTypes, type Guessable, type UnitType } from "src/data/common";
import { encodeGameURL, isGameOptions, validateGameOptions, type GameOptions, type GameType } from "src/gameOptions";
import {
    CarIcon,
    COAIcon,
    DiceIcon,
    FlagIcon,
    IconButton,
    LargeButton,
    LargeDropdown,
    LocationIcon,
    PlaceNameIcon,
    SmallArrowRightIcon,
    SwapIcon,
    TargetIcon
} from "src/ui";
import { useAnimation } from "src/utils/useAnimation";

export function ModePicker() {
    const navigate = useNavigate();

    const initialOptions = useMemo(() => getInitialOptions(), []);
    const [guess, setGuess] = useState<Guessable>(initialOptions.guess);
    const [guessFrom, setGuessFrom] = useState<Guessable>(initialOptions.guessFrom);
    const [unitType, setUnitType] = useState<UnitType>(initialOptions.unitType);

    const handleSwapClick = () => {
        setGuess(guessFrom);
        setGuessFrom(guess);
    };

    const [isInvalidAnim, startInvalidAnim] = useAnimation(450);
    const handlePlayClick = () => {
        const gameType: GameType = (guess === "map") ? "mapGame" : "choiceGame";

        const options: GameOptions = {
            gameType,
            unitType,
            guessFrom,
            guess,
            maxQuestions: 20,
            filters: {
                countyTypes: [],
                voivodeships: [],
            },
        };
        localStorage.setItem("QuizPowiaty.lastPickerMode", JSON.stringify(options));

        if (validateGameOptions(options)) {
            navigate(encodeGameURL(options));
        } else {
            startInvalidAnim();
        }
    };

    const handleRandomGameClick = () => {
        const options = getRandomGameOptions();
        localStorage.setItem("QuizPowiaty.lastPickerMode", JSON.stringify(options));
        navigate(encodeGameURL(options));
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

            <div className="flex items-center justify-between my-[-2px]">
                <p className="text-[18px] tracking-[0.01em]">
                    na podstawie jego...
                </p>

                <IconButton
                    icon={SwapIcon}
                    onClick={handleSwapClick}
                />
            </div>

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

            <LargeButton
                short
                text="Losowy tryb gry"
                icon={DiceIcon}
                onClick={handleRandomGameClick}
            />
        </div>
    );
}

function getInitialOptions(): GameOptions {
    const keyValue = localStorage.getItem("QuizPowiaty.lastPickerMode");
    if (keyValue) {
        const options = JSON.parse(keyValue);
        if (isGameOptions(options)) {
            return options;
        }
    }
    return {
        gameType: "choiceGame",
        unitType: "county",
        guessFrom: "name",
        guess: "map",
        maxQuestions: 20,
        filters: {
            countyTypes: [],
            voivodeships: [],
        },
    };
}

function getRandomGameOptions(): GameOptions {
    const guessFromIndex = Math.floor(Math.random() * guessables.length);
    const guessFrom = guessables[guessFromIndex];

    const guessOptions = guessables.filter((guessable) => guessable !== guessFrom);
    const guessIndex = Math.floor(Math.random() * guessOptions.length);
    const guess = guessOptions[guessIndex];

    let unitType: UnitType;
    // detect voivodeship-only combos
    if (guessFrom === "name" && guess === "capital" || guessFrom === "capital" && guess === "name") {
        unitType = "voivodeship";
    } else {
        const unitTypeIndex = Math.floor(Math.random() * unitTypes.length);
        unitType = unitTypes[unitTypeIndex];
    }

    return {
        gameType: (guess === "map") ? "mapGame" : "choiceGame",
        unitType,
        guessFrom,
        guess,
        maxQuestions: 20,
        filters: {
            countyTypes: [],
            voivodeships: [],
        },
    };
}
