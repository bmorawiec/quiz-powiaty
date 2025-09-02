import { NavLink } from "react-router";
import { CarIcon, COAIcon, FlagIcon, InfoIcon, LocationIcon, PlaceNameIcon, TargetIcon } from "../../icons";
import { Logo } from "../../Logo";
import { Destination } from "./Destination";
import { DropdownDestination } from "./DropdownDestination";
import { DropdownTile } from "./DropdownTile";

export function Nav() {
    return (
        <nav className="relative flex pt-[20px] pb-[18px] mx-[20px] lg:mx-[100px]">
            <NavLink
                to="/"
                aria-label="Przejdź do strony głównej"
                className="mr-[5px] flex items-center px-[20px] h-[50px] rounded-[6px] focus-ring
                    text-teal-80 hover:text-teal-70 dark:text-teal-60 dark:hover:text-teal-50
                    transition-colors duration-100"
            >
                <Logo/>
            </NavLink>

            <DropdownDestination label="Powiaty" where="/gry/powiaty">
                <DropdownTile icon={PlaceNameIcon} title="Nazwy" where="/gry/powiaty/nazwy">
                    <p>Zgadnij nazwę powiatu</p>
                    <p>Zgadnij powiat po nazwie</p>
                </DropdownTile>

                <DropdownTile icon={CarIcon} title="Rejestracje" where="/gry/powiaty/rejestracje">
                    <p>Zgadnij wyróżnik rejestracji powiatu</p>
                    <p>Zgadnij powiat po wyróżniku rejestracji</p>
                </DropdownTile>

                <DropdownTile icon={COAIcon} title="Godła" where="/gry/powiaty/godla">
                    <p>Zgadnij godło powiatu</p>
                    <p>Zgadnij powiat po godle</p>
                </DropdownTile>

                <DropdownTile icon={TargetIcon} title="Stolice" where="/gry/powiaty/stolice">
                    <p>Zgadnij nazwy stolic powiatu</p>
                    <p>Zgadnij powiat po nazwach stolic</p>
                </DropdownTile>

                <DropdownTile icon={FlagIcon} title="Flagi" where="/gry/powiaty/flagi">
                    <p>Zgadnij flagę powiatu</p>
                    <p>Zgadnij powiat po fladze</p>
                </DropdownTile>

                <DropdownTile icon={LocationIcon} title="Mapa" where="/gry/powiaty/mapa">
                    <p>Znajdź powiat na mapie</p>
                    <p>Zgadnij powiat po lokalizacji na mapie</p>
                </DropdownTile>
            </DropdownDestination>

            <DropdownDestination label="Województwa" where="/gry/wojewodztwa">
                <DropdownTile icon={PlaceNameIcon} title="Nazwy" where="/gry/wojewodztwa/nazwy">
                    <p>Zgadnij nazwę województwa</p>
                    <p>Zgadnij województwo po nazwie</p>
                </DropdownTile>

                <DropdownTile icon={CarIcon} title="Rejestracje" where="/gry/wojewodztwa/rejestracje">
                    <p>Zgadnij wyróżnik rejestracji województwa</p>
                    <p>Zgadnij województwo po wyróżniku rejestracji</p>
                </DropdownTile>

                <DropdownTile icon={COAIcon} title="Godła" where="/gry/wojewodztwa/godla">
                    <p>Zgadnij godło województwa</p>
                    <p>Zgadnij województwo po godle</p>
                </DropdownTile>

                <DropdownTile icon={TargetIcon} title="Stolice" where="/gry/wojewodztwa/stolice">
                    <p>Zgadnij nazwy stolic województwa</p>
                    <p>Zgadnij województwo po nazwach stolic</p>
                </DropdownTile>

                <DropdownTile icon={FlagIcon} title="Flagi" where="/gry/wojewodztwa/flagi">
                    <p>Zgadnij flagę województwa</p>
                    <p>Zgadnij województwo po fladze</p>
                </DropdownTile>

                <DropdownTile icon={LocationIcon} title="Mapa" where="/gry/wojewodztwa/mapa">
                    <p>Znajdź województwo na mapie</p>
                    <p>Zgadnij województwo po lokalizacji na mapie</p>
                </DropdownTile>
            </DropdownDestination>

            <Destination
                label="Statystyki"
                where="/statystyki"
            />

            <Destination
                label="Nauka"
                where="/nauka"
            />

            <button
                aria-haspopup="dialog"
                className="ml-auto flex items-center gap-[8px] cursor-pointer h-[50px] px-[20px] rounded-full
                    font-[450] text-[16px] tracking-[0.01em] transition-colors duration-80 focus-ring
                    hover:bg-gray-10 active:bg-gray-15 dark:hover:bg-gray-90 dark:active:bg-gray-95"
            >
                <InfoIcon/>
                <span>O stronie...</span>
            </button>
        </nav>
    );
}
