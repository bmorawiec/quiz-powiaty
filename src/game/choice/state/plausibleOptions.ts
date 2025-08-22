import type { Unit } from "src/data";
import type { GameOptions } from "src/game/common";
import { swapDiacritics } from "src/utils/diacritics";
import type { QuestionOption } from "./types";

/** Creates question options that are plausible answers to the question. */
export function getPlausibleOptions(unit: Unit, allUnits: Unit[], options: GameOptions): QuestionOption[] {
    if (options.guess === "plate" && (options.guessFrom === "name" || options.guessFrom === "capital")) {
        return getPlausiblePlateOptions(unit, allUnits);
    } else if (options.guessFrom === "plate" && (options.guess === "name" || options.guess === "capital")) {
        return getPlausibleNameOrCapitalOptions(unit, allUnits, options);
    } else {
        return [];
    }
}

function getPlausiblePlateOptions(unit: Unit, allUnits: Unit[]): QuestionOption[] {
    const pairs = [];
    for (const answerUnit of allUnits) {
        // skip unit if it's the correct answer, or if the county types of units don't match
        if (answerUnit === unit || answerUnit.countyType !== unit.countyType) {
            continue;
        }
        let scoreSum = 0;
        for (const plate of answerUnit.plates) {
            const nameScore = getPlateScore(plate, unit.name);
            const capitalScores = unit.capitals.map((capital) => getPlateScore(plate, capital));
            const score = Math.max(nameScore, ...capitalScores);
            scoreSum += score;
        }
        pairs.push({
            score: scoreSum / answerUnit.plates.length,
            option: {
                id: answerUnit.id,
                correct: false,
                value: answerUnit.plates.join(", "),
            } satisfies QuestionOption,
        });
    }
    return pairs
        .sort((a, b) => b.score - a.score)
        .slice(0, 5)
        .map((obj) => obj.option);
}

function getPlausibleNameOrCapitalOptions(unit: Unit, allUnits: Unit[], options: GameOptions): QuestionOption[] {
    const pairs = [];
    for (const answerUnit of allUnits) {
        if (answerUnit === unit || answerUnit.countyType !== unit.countyType) {
            continue;
        }

        const strings = (options.guess === "name") ? [answerUnit.name] : answerUnit.capitals;

        let scoreSum = 0;
        for (const plate of unit.plates) {
            let scoreSum2 = 0;
            for (const str of strings) {
                const score = getPlateScore(plate, str);
                scoreSum2 += score;
            }
            scoreSum += scoreSum2 / strings.length;
        }
        pairs.push({
            score: scoreSum / unit.plates.length,
            option: {
                id: answerUnit.id,
                correct: false,
                value: strings.join(", "),
            } satisfies QuestionOption,
        });
    }
    return pairs
        .sort((a, b) => b.score - a.score)
        .slice(0, 5)
        .map((obj) => obj.option);
}

/** Assigns a score to a car plate based on how much it matches the provided string
 *  score       example
 *              3 letter plate          2 letter plate          1 letter plate
 *              plate   string          plate string            plate   string
 *
 *  10 000      LJA     Jasło           not assigned            not assigned
 *               ^^     ^^
 *  1 000       RZE     Zgorzelec       not assigned            not assigned
 *               ^^     ^    ^
 *  500         RLS     Ruda Śląska     not assigned            not assigned
 *              ^^^     ^     ^ ^
 *  100         BHA     Hrubieszów      BH      Hrubieszów      not assigned
 *               ^      ^                ^      ^
 *  50          KRA     Kartuzy         KR      Kartuzy         not assigned
 *              ^^      ^ ^             ^^      ^ ^
 *  5           LZA     Łódź            LZ      Łódź            L       Łódź
 *              ^       ^               ^       ^               ^       ^
 */
function getPlateScore(plate: string, str: string): number {
    if (plate.length === 1) {                   // skip the rest of the fn for 3 letter plates
        const upperFirst = swapDiacritics(str[0].toUpperCase());
        if (upperFirst === plate) {
            return 5;
        } else {
            return 0;
        }
    }

    const upperCaseStr = swapDiacritics(str.toUpperCase());
    if (plate.slice(1) === upperCaseStr.slice(0, 2)) {  // always false for 2 letter plates
        return 10_000;
    }

    let score = 0;
    if (upperCaseStr[0] === plate[1]) {
        const index = upperCaseStr.indexOf(plate[2]);   // -1 for 2 letter plates
        if (index > 0) score += 1_000;
        else score += 100;
    }
    if (upperCaseStr[0] === plate[0]) {
        const index1 = upperCaseStr.indexOf(plate[1]);
        const index2 = upperCaseStr.indexOf(plate[2]);  // -1 for 2 letter plates
        if (index1 > 0) {
            if (index2 > 0 && index1 < index2) score += 500;
            else score += 50;
        } else {
            score += 5;
        }
    }
    return score;
}

