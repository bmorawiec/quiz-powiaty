import { useEffect, useState } from "react";

const query = window.matchMedia("(prefers-color-scheme: dark)");

/** Changes when the (prefers-color-scheme: dark) media query changes. */
export function useDarkMode(): boolean {
    const [isDarkMode, setIsDarkMode] = useState(query.matches);

    useEffect(() => {
        const handleQueryChange = () => {
            setIsDarkMode(query.matches);
        };

        query.addEventListener("change", handleQueryChange);
        return () => query.removeEventListener("change", handleQueryChange);
    }, []);

    return isDarkMode;
}
