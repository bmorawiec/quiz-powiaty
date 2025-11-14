import { useState, useEffect, useCallback } from "react";

/** Used to store information about whether or not an animation should be playing and when it should stop playing.
 *  @returns [animating, startAnimation]
 *  animating - If true, then the animation should be shown.
 *  startAnimation - Starts the animation. */
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
