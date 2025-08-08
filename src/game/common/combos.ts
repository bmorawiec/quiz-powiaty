import type { Guessable } from "src/data";

/** Checks if the specified combination of guessFrom and guess field values is valid for the current game. */
export function isValidCombo(
    validCombos: Partial<Record<Guessable, Guessable[]>>,
    guessFrom: Guessable,
    guess: Guessable,
): boolean {
    return !!validCombos[guessFrom]?.includes(guess);
}
