import clsx from "clsx";
import React, { useCallback, useEffect, useRef, useState, type ReactNode } from "react";
import { DropdownContext, type DropdownItemContent } from "./state";
import { DropdownItemContentView } from "./DropdownItemContent";
import { SelectIcon } from "../icons";

export interface DropdownProps {
    value: string;
    onChange: (newValue: string) => void;
    /** Children of this component should be DropdownItem components. */
    children?: ReactNode;
    className?: string;
}

/** Displays a dropdown.
 *  @example
 *  ```tsx
 *  <Dropdown value="apple">
 *      <DropdownItem value="none" label="None"/>
 *      <DropdownItem value="apple" icon={AppleIcon} label="Apple"/>
 *      <DropdownItem value="banana" icon={BananaIcon} label="Banana"/>
 *      <DropdownItem value="coconut" icon={CoconutIcon} label="Coconut"/>
 *  </Dropdown>
 *  ```
 *  This will cause a dropdown with four entries to be rendered. The entry with the label "Apple" will be selected.  */
export function Dropdown({ value, onChange, children, className }: DropdownProps) {
    const [open, setOpen] = useState(false);

    const handleClick = () => {
        setOpen(!open);
    };

    // A key-value map indexed by item values.
    // items[val] is the content of the item with the value `val`.
    const [items, setItems] = useState<Record<string, DropdownItemContent | undefined>>({});

    const registerItem = useCallback((value: string, content: DropdownItemContent) => {
        setItems((items) => ({
            ...items,
            [value]: content,
        }));
    }, []);

    const unregisterItem = useCallback((value: string) => {
        setItems((items) => {
            const newItems = { ...items };
            delete newItems[value];
            return newItems;
        });
    }, []);

    const changeValue = useCallback((value: string) => {
        onChange(value);
        setOpen(false);
    }, [onChange]);

    const containerRef = useRef<HTMLDivElement>(null);
    const buttonRef = useRef<HTMLButtonElement>(null);
    const menuRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (open) {
            const handleDocumentClick = (event: MouseEvent) => {
                if (!containerRef.current) throw new Error("Component hasn't mounted properly.");
                if (!containerRef.current.contains(event.target as HTMLElement | null)) {
                    setOpen(false);         // Close dropdown, if the user clicked something outside it.
                }
            };

            document.addEventListener("click", handleDocumentClick);
            return () => document.removeEventListener("click", handleDocumentClick);
        }
    }, [open]);

    // Focuses the dropdown button when the menu closes.
    useEffect(() => {
        if (!open) {
            if (!buttonRef.current) throw new Error("Component hasn't mounted properly.");
            buttonRef.current.focus();
        }
    }, [open]);

    // Arrow key navigation
    const handleKeyDown = (event: React.KeyboardEvent) => {
        if (open && (event.key === "ArrowUp" || event.key === "ArrowDown")) {
            if (!menuRef.current) throw new Error("Component hasn't mounted properly.")
            const currentlyFocused = menuRef.current.querySelector("button:focus");

            if (currentlyFocused) {
                const elementToFocus = (event.key === "ArrowUp")
                    ? currentlyFocused.previousElementSibling
                    : currentlyFocused.nextElementSibling;
                if (elementToFocus) {
                    if (!(elementToFocus instanceof HTMLButtonElement)) {
                        throw new Error("Children of this component must be DropdownItem components.");
                    }
                    elementToFocus?.focus();
                }
                // If elementToFocus is null, then we have reached the end of the list.
            } else {
                const firstElement = menuRef.current.children[0];
                if (firstElement) {
                    if (!(firstElement instanceof HTMLButtonElement)) {
                        throw new Error("Children of this component must be DropdownItem components.");
                    }
                    firstElement.focus();
                }
                // If elementToFocus is undefined, then there are no items in the dropdown.
            }
        }
    };

    const content = items[value];
    return (
        <DropdownContext value={{ open, value, registerItem, unregisterItem, changeValue }}>
            <div
                ref={containerRef}
                className={clsx("relative h-[40px]", className)}
                onKeyDown={handleKeyDown}
            >
                <button
                    ref={buttonRef}
                    className={clsx("size-full border border-black/13 dark:border-white/13 rounded-[10px]",
                        "cursor-pointer focus-ring transition-colors duration-80 flex items-center pr-[12px]",
                        "hover:bg-black/5 active:bg-black/8 dark:hover:bg-white/4 dark:active:bg-white/6 overflow-hidden")}
                    onClick={handleClick}
                >
                    {content && (
                        <DropdownItemContentView
                            content={content}
                            className="flex-1"
                        />
                    )}
                    <SelectIcon className="size-[12px] shrink-0"/>
                </button>

                <div
                    ref={menuRef}
                    className={clsx("z-100 absolute left-[-5px] right-[-5px] top-[50px] bg-white dark:bg-gray-90",
                        "flex flex-col shadow-sm shadow-black/10 rounded-[14px] p-[8px]", !open && "hidden")}
                >
                    {children}
                </div>
            </div>
        </DropdownContext>
    );
}
