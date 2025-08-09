import clsx from "clsx";
import { useEffect, useRef } from "react";
import type { UnitFilterMode } from "src/game/common";
import { ApplyIcon, CloseIcon, MinusIcon } from "../icons";

export interface FilterInputButtonProps {
    mode: UnitFilterMode | undefined;
    active: boolean;
    onClick: () => void;
}

export function FilterInputButton({ mode, active, onClick }: FilterInputButtonProps) {
    const pointerDown = useRef(false);

    useEffect(() => {
        const handleDocumentPointerDown = () => {
            pointerDown.current = true;
        };

        const handleDocumentPointerUp = () => {
            pointerDown.current = false;
        };

        document.addEventListener("pointerdown", handleDocumentPointerDown);
        document.addEventListener("pointerup", handleDocumentPointerUp);
        return () => {
            document.removeEventListener("pointerdown", handleDocumentPointerDown);
            document.removeEventListener("pointerup", handleDocumentPointerUp);
        };
    }, []);

    const handlePointerEnter = () => {
        if (pointerDown.current) {
            onClick();
        }
    };

    const Icon = (mode === undefined)
        ? MinusIcon
        : (mode === "include") ? ApplyIcon : CloseIcon;

    return (
        <button
            className="px-[3px] first:pl-[5px] rounded-[1px] first:rounded-s-[4px] last:pr-[5px] last:rounded-e-[4px]
                py-[5px] focus-ring group"
            onPointerDown={onClick}
            onPointerOver={handlePointerEnter}
        >
            <div className={clsx("size-[24px] rounded-[4px] flex items-center justify-center",
                (active)
                    ? (mode === undefined)
                        ? "bg-gray-20 dark:bg-gray-80"
                        : (mode === "include")
                            ? "bg-teal-70 text-white dark:bg-teal-80" 
                            : "bg-red-60 text-white dark:bg-red-65"
                    : "group-hover:bg-gray-10 dark:group-hover:bg-gray-90")}>
                <Icon className="size-[12px]" />
            </div>
        </button>
    );
}
