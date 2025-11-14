import { useEffect, useState } from "react";

/** Changes when the device pixel ratio changes. */
export function useDevicePixelRatio(): number {
    const [dpr, setDPR] = useState(window.devicePixelRatio);

    useEffect(() => {
        const handleWindowResize = () => {
            setDPR(window.devicePixelRatio);
        };

        window.addEventListener("resize", handleWindowResize);
        return () => window.removeEventListener("resize", handleWindowResize);
    }, []);

    return dpr;
}
