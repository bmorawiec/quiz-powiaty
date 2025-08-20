import { useState, useEffect, useCallback } from "react";

export function useAnimation(animationLengthMs: number): [boolean, () => void] {
    const [animating, setAnimating] = useState(false);

    useEffect(() => {
        if (animating) {
            let animTimeout: number | null = setTimeout(() => {
                animTimeout = null;
                setAnimating(false);
            }, animationLengthMs);

            return () => {
                if (animTimeout) {
                    clearTimeout(animTimeout);
                }
            };
        }
    }, [animating, animationLengthMs]);

    const startAnimation = useCallback(() => {
        setAnimating(true);
    }, []);

    return [animating, startAnimation];
}
