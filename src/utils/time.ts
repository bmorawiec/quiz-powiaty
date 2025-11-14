/** Converts time in milliseconds to minutes and seconds. */
export function toMinutesAndSeconds(timeDiff: number): [number, number] {
    const timeDiffSeconds = Math.floor(timeDiff / 1000);
    const minutes = Math.floor(timeDiffSeconds / 60);
    const seconds = Math.floor(timeDiffSeconds % 60);
    return [minutes, seconds];
}
