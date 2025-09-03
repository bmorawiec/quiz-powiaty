import type { GameOptions } from "src/gameOptions";
import type { Question } from "./state";

const TRIES_FOR_HINT = 1;
const TRIES_FOR_FULL_HINT = 6;

/** Returns a hint for the current prompt,
 *  if the player has exceeded the minimum number of incorrect guesses for a hint.
 *  Otherwise returns null. */
export function getTextHint(question: Question, options: GameOptions): string | null {
    if (question.tries < TRIES_FOR_HINT) {
        return null;
    }
    if (question.tries >= TRIES_FOR_FULL_HINT) {
        return question.answers
            .map((answer) => answer.text)
            .join(", ");
    }

    const noOfLetters = question.tries - TRIES_FOR_HINT + 1;      // how many letters to uncover
    if (options.guess === "plate") {
        return question.answers
            .map((answer) => {
                if (!answer.text)
                    throw new Error("Cannot generate text hint for a non-text answer.");

                if (noOfLetters > answer.text.length) {
                    return answer.text;
                }
                const uncoveredLetters = answer.text.slice(0, noOfLetters);
                return uncoveredLetters.padEnd(answer.text.length, "*");
            })
            .join(", ");
    } else if (options.guess === "name" || options.guess === "capital") {
        return question.answers
            .map((answer) => {
                if (!answer.text)
                    throw new Error("Cannot generate text hint for a non-text answer.");

                let hint = "";
                for (let index = 0; index < answer.text.length; index++) {
                    const char = answer.text[index];
                    if (char === " " || char === "-") {
                        hint += char;
                    } else if (index < noOfLetters || index >= answer.text.length - noOfLetters) {
                        hint += char;
                    } else {
                        hint += "*";
                    }
                }
                return hint;
            })
            .join(", ");
    }
    return null;
}
