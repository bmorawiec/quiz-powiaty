import { useMemo } from "react";
import { FinishedViewBase, GameModeCard, GuessDistribution, ProgressBar } from "../../common";
import { calculateTime, useChoiceGameStore } from "../state";
import type { GameOptions } from "src/gameOptions";
import { QuestionBrowser } from "./QuestionBrowser";

export interface FinishedViewProps {
    options: GameOptions;
    onRestart: () => void;
}

export function FinishedView({ options, onRestart }: FinishedViewProps) {
    const questions = useChoiceGameStore((state) => state.questions);

    const [points, maxPoints, percent, guessDistribution] = useMemo(() => {
        let pointSum = 0;
        const guessDistribution: [number, number, number, number] = [0, 0, 0, 0];
        for (const question of questions) {
            const points = Math.max(3 - question.tries, 0);
            pointSum += points;
            guessDistribution[points]++;
        }
        const maxPoints = questions.length * 3;
        const frac = pointSum / maxPoints;
        const percent = (frac < 0.5)
            ? Math.ceil(frac * 100)
            : Math.floor(frac * 100);
        return [pointSum, maxPoints, percent, guessDistribution];
    }, [questions]);

    const time = useMemo(
        () => calculateTime(),
        [],
    );
    
    return (
        <FinishedViewBase
            onRestart={() => onRestart()}
        >
            <ProgressBar
                percent={percent}
                points={points}
                maxPoints={maxPoints}
            />

            <GameModeCard
                options={options}
                time={time}
            />

            <GuessDistribution
                data={guessDistribution}
            />

            <QuestionBrowser/>
        </FinishedViewBase>
    );
}
