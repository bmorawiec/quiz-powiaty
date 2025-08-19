import clsx from "clsx";
import { useEffect } from "react";
import { CloseIcon, InfoIcon } from "../../icons";
import { Destination } from "./Destination";

export interface DrawerProps {
    state: "slideIn" | "slideOut" | "hidden";
    onClose: () => void;
}

export function Drawer({ state, onClose }: DrawerProps) {
    const show = state !== "hidden";
    useEffect(() => {
        if (show) {
            const handleDocumentKeyDown = (event: KeyboardEvent) => {
                if (event.key === "Escape") {
                    onClose();
                }
            };

            document.addEventListener("keydown", handleDocumentKeyDown);
            return () => document.removeEventListener("keydown", handleDocumentKeyDown);
        }
    }, [show, onClose]);

    if (!show) {
        return null;
    }

    return (<>
        <div
            className={clsx("bg-black/20 fixed left-0 top-0 size-full z-1000",
                (state === "slideIn") ? "animate-fade-in-slow" : "animate-fade-out-slow")}
            onPointerDown={onClose}
        />
        <div
            role="navigation"
            className={clsx("flex flex-col bg-white dark:bg-gray-90 fixed left-0 top-0 w-[450px] max-xs:w-full h-full",
                "p-[15px] pb-[30px] shadow-sm shadow-black/20 dark:shadow-black overflow-auto z-1000",
                (state === "slideIn") ? "animate-slide-in-left" : "animate-slide-out-left")}
        >
            <button
                aria-label="Zamknij menu nawigacji"
                className="ml-auto mr-[10px] mt-[10px] size-[50px] shrink-0 flex items-center justify-center focus-ring
                    cursor-pointer rounded-full hover:bg-gray-10 dark:hover:bg-gray-80
                    active:bg-gray-15 dark:active:bg-gray-85 transition-colors duration-80"
                onClick={onClose}
            >
                <CloseIcon/>
            </button>

            <Destination label="Powiaty" where="/powiaty"/>
            <Destination label="Województwa" where="/wojewodztwa"/>
            <Destination label="Statystyki" where="/statystyki"/>
            <Destination label="Nauka" where="/nauka" className="mb-[10px]"/>

            <button
                aria-haspopup="dialog"
                className="mt-auto shrink-0 flex items-center gap-[8px] cursor-pointer h-[60px] px-[25px] rounded-full
                    font-[450] text-[18px] hover:bg-gray-10 dark:hover:bg-gray-80 focus-ring
                    transition-colors duration-80 active:bg-gray-15 dark:active:bg-gray-85"
            >
                <InfoIcon/>
                <span>O stronie...</span>
            </button>
        </div>
    </>);
}
