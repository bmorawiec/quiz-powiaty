import { useEffect, useState } from "react";

export type Breakpoint = (typeof breakpoints)[number];
const breakpoints = ["xs", "sm", "md", "lg", "xl"] as const;  // ordered from smallest to largest

export function useBreakpoints() {
    const [layout, setLayout] = useState<Breakpoint>(layoutFromWindowSize(window.innerWidth));

    useEffect(() => {
        const handleWindowResize = () => {
            const layout = layoutFromWindowSize(window.innerWidth);
            setLayout(layout);
        };

        window.addEventListener("resize", handleWindowResize);
        return () => window.removeEventListener("resize", handleWindowResize);
    }, []);

    return layout;
}

// same as index.css
const breakpointWidths: Record<Breakpoint, number> = {
    xs: 600,
    sm: 1000,
    md: 1400,
    lg: 1800,
    xl: 2000,
};

function layoutFromWindowSize(windowWidth: number): Breakpoint {
    for (const bp of breakpoints) {
        if (windowWidth < breakpointWidths[bp]) {
            return bp;
        }
    }

    return breakpoints[breakpoints.length - 1];
}
