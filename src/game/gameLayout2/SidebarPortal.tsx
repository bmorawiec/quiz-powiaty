import { useContext, type ReactNode } from "react";
import { createPortal } from "react-dom";
import { SidebarPortalContext } from "./sidebarPortalContext";

export interface SidebarPortalProps {
    children?: ReactNode;
}

export function SidebarPortal({ children }: SidebarPortalProps) {
    const elem = useContext(SidebarPortalContext);
    if (elem) {
        return createPortal(children, elem);
    }
}
