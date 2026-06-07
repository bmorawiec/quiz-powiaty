import { createContext, type ComponentType } from "react";
import type { IconProps } from "../icons";

export interface DropdownAPI {
    open: boolean;
    value: string;
    registerItem: (value: string, content: DropdownItemContent) => void;
    unregisterItem: (value: string) => void;
    changeValue: (value: string) => void;
}

export const DropdownContext = createContext<DropdownAPI | null>(null);

export interface DropdownItemContent {
    icon?: ComponentType<IconProps>;
    label: string;
}
