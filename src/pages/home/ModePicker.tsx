import { useState } from "react";
import { NavLink, useNavigate } from "react-router";
import type { Guessable } from "src/data";
import { LargeDropdown } from "src/ui";
import { CarIcon, COAIcon, FlagIcon, LocationIcon, PlaceNameIcon, SmallArrowRightIcon, TargetIcon } from "src/ui/icons";

const guessableToPolish: Record<Guessable, string> = {
    name: "nazwa",
    capital: "stolica",
    plate: "rejestracja",
    flag: "flaga",
    coa: "herb",
    map: "mapa",
};

export function ModePicker() {
    const navigate = useNavigate();

    const [guess, setGuess] = useState<Guessable>("map");
    const [guessFrom, setGuessFrom] = useState<Guessable>("name");
    const [type, setType] = useState<"county" | "voivodeship">("county");

    const handlePlayClick = () => {
        const mode = (guess === "map") ? "znajdz" : "wybierz";
        const url = "/graj"
            + "?tryb=" + mode
            + "&dane=" + guessableToPolish[guessFrom]
            + "&zgadnij=" + guessableToPolish[guess];
        navigate(url);
    };

    return (
        <div className="w-[480px] p-[30px] bg-white dark:bg-black rounded-[20px] shadow-sm shadow-black/10
            flex flex-col gap-[12px]">

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
                    value={type}
                    className="xs:w-[160px]"
                    onChange={setType}
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

            <button
                className="mt-auto flex items-center justify-center gap-[2px] h-[60px] rounded-[10px]
                    cursor-pointer text-[18px] font-[450] transition-colors duration-100
                    bg-teal-70 hover:bg-teal-65 text-white dark:bg-teal-80 hover:dark:bg-teal-85"
                onClick={handlePlayClick}
            >
                <span>Zacznij grę</span>
                <SmallArrowRightIcon/>
            </button>

            <NavLink
                to="/quizy"
                className="flex items-center justify-center h-[50px] rounded-[10px]
                    text-[18px] transition-colors duration-100
                    bg-gray-10 hover:bg-gray-15 text-black-100 dark:bg-gray-90 dark:hover:bg-gray-95"
            >
                <span>Wszystkie tryby gry</span>
            </NavLink>
        </div>
    );
}
