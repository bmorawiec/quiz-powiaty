import { createContext } from "react";

/** Contains the element that should contain game-mode-rendered sidebar content */
export const SidebarPortalContext = createContext<HTMLDivElement | null>(null);
