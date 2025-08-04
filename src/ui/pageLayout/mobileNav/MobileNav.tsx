import { useEffect, useRef, useState } from "react";
import { NavLink } from "react-router";
import { Logo } from "src/ui/Logo";
import { MenuIcon } from "../../icons";
import { Drawer } from "./Drawer";

export function MobileNav() {
    const [drawerState, setDrawerState] = useState<"slideIn" | "slideOut" | "hidden">("hidden");

    const handleMenuButtonClick = () => {
        setDrawerState("slideIn");
    };

    const animOutTimeout = useRef<number | null>(null);
    useEffect(() => {
        return () => {  // clear animation timeout if component unmounts before the slide out animation finishes.
            if (animOutTimeout.current) clearTimeout(animOutTimeout.current);
        };
    }, []);

    const handleDrawerClose = () => {
        setDrawerState("slideOut");
        animOutTimeout.current = setTimeout(
            () => setDrawerState("hidden"),
            300,
        );
    };

    return (
        <div className="flex items-center px-[20px] pt-[20px] pb-[18px] gap-[5px]">
            <button
                aria-label="Otwórz menu nawigacji"
                aria-haspopup="menu"
                className="size-[50px] shrink-0 flex items-center justify-center cursor-pointer rounded-full
                    text-gray-100 hover:bg-gray-10 active:bg-gray-15
                    dark:text-gray-10 dark:hover:bg-gray-85 dark:active:bg-gray-90
                    transition-colors duration-80"
                onClick={handleMenuButtonClick}
            >
                <MenuIcon/>
            </button>

            <Drawer
                state={drawerState}
                onClose={handleDrawerClose}
            />

            <NavLink
                to="/"
                className="flex items-center h-[50px]
                    text-teal-80 hover:text-teal-70 dark:text-teal-60 dark:hover:text-teal-50
                    transition-colors duration-100"
            >
                <Logo/>
            </NavLink>
        </div>
    );
}
