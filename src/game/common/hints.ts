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
            .map((answer) => answer.value)
            .join(", ");
    }

    const noOfLetters = question.tries - TRIES_FOR_HINT + 1;      // how many letters to uncover
    if (options.guess === "plate") {
        return question.answers
            .map((answer) => {
                if (noOfLetters > answer.value.length) {
                    return answer.value;
                }
                const uncoveredLetters = answer.value.slice(0, noOfLetters);
                return uncoveredLetters.padEnd(answer.value.length, "*");
            })
            .join(", ");
    } else if (options.guess === "name" || options.guess === "capital") {
        return question.answers
            .map((answer) => {
                let hint = "";
                for (let index = 0; index < answer.value.length; index++) {
                    const char = answer.value[index];
                    if (char === " " || char === "-") {
                        hint += char;
                    } else if (index < noOfLetters || index >= answer.value.length - noOfLetters) {
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
