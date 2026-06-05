import clsx from "clsx";
import { useMemo, useState } from "react";
import { useNavigate } from "react-router";
import {
    getRandomOptions,
    optionsToURL,
    validateGameOptions,
    type GameOptions,
    type Guessable,
    type UnitType
} from "src/game2/options";
import {
    ArrowRightIcon,
    CarIcon,
    COAIcon,
    DiceIcon,
    FlagIcon,
    IconButton,
    LargeButton,
    LargeDropdown,
    PlaceNameIcon,
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
        const options: GameOptions = {
            mode: "choiceGame",
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
            navigate("/graj2" + optionsToURL(options));
        } else {
            startInvalidAnim();
        }
    };

    const handleRandomGameClick = () => {
        const options = getRandomOptions();
        localStorage.setItem("QuizPowiaty.lastPickerMode", JSON.stringify(options));
        navigate("/graj2" + optionsToURL(options));
    };

    return (
        <div className="w-[460px] h-[650px]
            p-[30px] pt-[28px] bg-white dark:bg-black rounded-[20px] shadow-sm shadow-black/10 flex flex-col">
            <p className="text-[18px] tracking-[0.01em]">
                Zgadnij...
            </p>

            <div className="flex gap-[10px] max-xs:flex-col mt-[10px]">
                <LargeDropdown
                    items={[
                        { value: "name", icon: PlaceNameIcon, label: "nazwę" },
                        { value: "capital", icon: TargetIcon, label: "stolicę" },
                        { value: "plate", icon: CarIcon, label: "rejestrację" },
                        { value: "flag", icon: FlagIcon, label: "flagę" },
                        { value: "coa", icon: COAIcon, label: "godło" },
                        { value: "shape", label: "kształt" },
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
                    className="xs:w-[155px]"
                    onChange={setUnitType}
                />
            </div>

            <div className="flex items-center justify-between mt-[13px] mb-[6px] pr-[4px]">
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
                    { value: "shape", label: "kształtu" },
                ]}
                value={guessFrom}
                onChange={setGuessFrom}
            />

            <LargeButton
                primary
                text="Zacznij grę"
                iconRight={ArrowRightIcon}
                className={clsx("mt-auto mb-[12px]", isInvalidAnim && "animate-shake")}
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
        return JSON.parse(keyValue);
    }
    return {
        mode: "choiceGame",
        unitType: "county",
        guessFrom: "name",
        guess: "plate",
        maxQuestions: 20,
        filters: {
            countyTypes: [],
            voivodeships: [],
        },
    };
}
