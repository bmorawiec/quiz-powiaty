import { useContext, useEffect, useRef, type ComponentType } from "react"
import { DropdownContext } from "./state"
import type { IconProps } from "../icons";
import clsx from "clsx";
import { DropdownItemContentView } from "./DropdownItemContent";

export interface DropdownItemProps {
    icon?: ComponentType<IconProps>;
    value: string;
    label: string;
}

/** A dropdown item. Must be placed inside a Dropdown component.
 *  @throws When placed outside a Dropdown component. */
export function DropdownItem({ icon, value, label }: DropdownItemProps) {
    const dropdown = useContext(DropdownContext);
    if (!dropdown) {
        throw new Error("This component should be placed inside a Dropdown component.");
    }

    const buttonRef = useRef<HTMLButtonElement>(null);

    useEffect(() => {
        dropdown.registerItem(value, { icon, label }); // Register item when component mounts or after props change
        return () => dropdown.unregisterItem(value);   // Unregister item when component unmounts or before props change
    }, [value, icon, label, dropdown.registerItem, dropdown.unregisterItem]);

    useEffect(() => {
        if (dropdown.open && dropdown.value === value) {
            if (!buttonRef.current) throw new Error("Component hasn't mounted properly.");
            // Focus item, when the dropdown has just opened and this item is currently selected.
            buttonRef.current.focus();
        }
    }, [dropdown.open]);

    const handleClick = () => {
        dropdown.changeValue(value);
    };

    return (
        <button
            ref={buttonRef}
            role="option"
            aria-selected={dropdown.value === value}
            className={clsx("flex items-center cursor-pointer h-[40px]",
                "rounded-[6px] transition-colors duration-80 focus-ring",
                (dropdown.value === value)
                    ? "bg-black/5 hover:bg-black/8 dark:bg-white/5 hover:dark:bg-white/8"
                    : "hover:bg-black/5 dark:hover:bg-white/5")}
            onClick={handleClick}
        >
            <DropdownItemContentView content={{ icon, label }}/>
        </button>
    );
}
