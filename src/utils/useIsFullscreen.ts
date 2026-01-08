import { useEffect, useState } from "react";

/** Returns true, if the website is currently in fullscreen mode. */
export function useIsFullscreen() {
    const [isFullscreen, setIsFullscreen] = useState(!!document.fullscreenElement);
    useEffect(() => {
        const handleFullscreenChange = () => {
            setIsFullscreen(!!document.fullscreenElement);
        };
        document.addEventListener("fullscreenchange", handleFullscreenChange);
    }, []);

    return isFullscreen;
}
