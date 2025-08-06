import clsx from "clsx";
import { useEffect, useRef, useState, type ComponentType } from "react";
import { DropdownIcon, type IconProps } from "../icons";
import { DropdownItem } from "./DropdownItem";

export interface LargeDropdownProps<TValue extends string> {
    items: LargeDropdownItem<TValue>[];
    value: TValue;
    className?: string;
    onChange?: (newValue: TValue) => void;
}

export interface LargeDropdownItem<TValue extends string> {
    value: TValue;
    icon?: ComponentType<IconProps>;
    label: string;
}

export function LargeDropdown<TValue extends string>({
    items,
    value,
    className,
    onChange,
}: LargeDropdownProps<TValue>) {
    if (items.length === 0)
        throw new Error("LargeDropdown: 'items' prop needs to have at least one entry.");

    const selectedItem = items.find((item) => item.value === value);
    if (!selectedItem)
        throw new Error("LargeDropdown: Could not find item with the specified value: " + value);
    const SelectedIcon = selectedItem.icon;

    const containerRef = useRef<HTMLDivElement | null>(null);
    const dropdownRef = useRef<HTMLButtonElement | null>(null);
    const menuRef = useRef<HTMLDivElement | null>(null);

    const [menuOpen, setMenuOpen] = useState(false);

    const menuAnimTimeout = useRef<number | null>(null);
    useEffect(() => {
        return () => {
            if (menuAnimTimeout.current) {  // stop fade-out animation if component unmounts before it finishes.
                clearTimeout(menuAnimTimeout.current);
                menuAnimTimeout.current = 0;
            }
        };
    }, []);

    useEffect(() => {
        if (menuOpen) {
            const selectedIndex = items.findIndex((item) => item.value === value);
            if (selectedIndex === -1)
                throw new Error("LargeDropdown: Could not find an item with the specified value: " + value);
            const selectedItemElem = menuRef.current!.children[selectedIndex];
            // focus element corresponding to selected item
            (selectedItemElem as HTMLButtonElement).focus();
        }
    }, [menuOpen]);    // only fire useEffect when menu closes or opens

    const handleClick = () => {
        setMenuOpen(!menuOpen);
    };

    const handleItemClick = (newValue: TValue) => {
        setMenuOpen(false);
        onChange?.(newValue);
        dropdownRef.current!.focus();   // focus dropdown after an item is chosen
    };

    useEffect(() => {
        const handleDocumentClick = (event: MouseEvent) => {
            if (!containerRef.current!.contains(event.target as HTMLElement | null)) {
                setMenuOpen(false);
            }
        };

        document.addEventListener('click', handleDocumentClick);
        return () => document.removeEventListener('click', handleDocumentClick);
    }, []);

    return (
        <div
            ref={containerRef}
            className={clsx("relative", className)}
        >
            <button
                ref={dropdownRef}
                role="combobox"
                aria-expanded={menuOpen}
                className="w-full h-[50px] border border-gray-20 dark:border-gray-75 rounded-[10px] flex items-center
                    pl-[9px] pr-[16px] cursor-pointer transition-colors duration-80
                    hover:border-gray-30 dark:hover:border-gray-65 text-gray-100 dark:text-gray-10"
                onClick={handleClick}
            >
                {SelectedIcon && (
                    <div className="flex items-center justify-center bg-gray-15 dark:bg-gray-80 size-[30px]
                        rounded-[6px] text-gray-100 dark:text-gray-10 mr-[6px]">
                        <SelectedIcon/>
                    </div>
                )}
                <span className="ml-[4px] flex-1 text-left text-[16px] font-[450] dark:text-gray-5 truncate">
                    {selectedItem.label}
                </span>
                <DropdownIcon className={clsx("transition-transform duration-100", menuOpen && "rotate-180")}/>
            </button>

            {menuOpen &&
                <div
                    ref={menuRef}
                    className="absolute left-0 top-[60px] w-full flex flex-col bg-white dark:bg-gray-90 z-100 p-[10px]
                        rounded-[16px] shadow-sm shadow-black/10 animate-fade-in"
                >
                    {items.map((item) =>
                        <DropdownItem
                            key={item.value}
                            value={item.value}
                            icon={item.icon}
                            label={item.label}
                            selected={value === item.value}
                            onClick={handleItemClick}
                        />
                    )}
                </div>
            }
        </div>
    );
}
