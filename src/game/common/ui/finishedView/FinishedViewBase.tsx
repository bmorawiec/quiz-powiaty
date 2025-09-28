import { useMemo } from "react";
import type { GameOptions } from "src/gameOptions";
import { LargeButton, LargeLink, RestartIcon } from "src/ui";
import { QuestionNotFoundError, type Answer, type Question } from "../../state";
import { GameModeCard } from "../GameModeCard";
import { GuessDistribution } from "./GuessDistribution";
import { ProgressBar } from "./ProgressBar";
import { QuestionList } from "./questionList";

export interface FinishedViewBaseProps {
    options: GameOptions;
    questions: Record<string, Question | undefined>;
    questionIds: string[];
    allAnswers: Record<string, Answer | undefined>;
    onRestart: () => void;
}

export function FinishedViewBase({ options, questions, questionIds, allAnswers, onRestart }: FinishedViewBaseProps) {
    const [points, maxPoints, percent, guessDistribution] = useMemo(() => {
        let pointSum = 0;
        const guessDistribution: [number, number, number, number] = [0, 0, 0, 0];
        for (const questionId of questionIds) {
            const question = questions[questionId];
            if (!question)
                throw new QuestionNotFoundError(questionId);

            const points = Math.max(3 - question.tries, 0);
            pointSum += points;
            guessDistribution[points]++;
        }
        const maxPoints = questionIds.length * 3;
        const frac = pointSum / maxPoints;
        const percent = (frac < 0.5)
            ? Math.ceil(frac * 100)
            : Math.floor(frac * 100);
        return [pointSum, maxPoints, percent, guessDistribution];
    }, [questions, questionIds]);

    return (
        <div className="flex-1 bg-gray-5 dark:bg-gray-95 sm:rounded-[20px] flex flex-col min-h-0">
            <div className="flex-1 overflow-y-auto pt-[58px] flex flex-col items-center">
                <div className="w-full max-w-[740px] flex flex-col gap-[22px] px-[20px] pb-[50px]">
                    <h2 className="text-[30px] text-gray-90 dark:text-gray-15 self-center">
                        Twój wynik
                    </h2>

                    <ProgressBar
                        percent={percent}
                        points={points}
                        maxPoints={maxPoints}
                    />

                    <GameModeCard
                        options={options}
                    />

                    <GuessDistribution
                        data={guessDistribution}
                    />

                    <QuestionList
                        questions={questions}
                        questionIds={questionIds}
                        allAnswers={allAnswers}
                        options={options}
                    />
                </div>
            </div>

            <div className="border-t border-gray-15">
                <div className="mx-auto w-full max-w-[740px] px-[20px] self-center grid xs:grid-cols-2
                    max-xs:grid-rows-2 gap-[10px] pb-[30px] max-sm:pb-[110px] pt-[25px]">
                    <LargeButton
                        primary
                        text="Zagraj od nowa"
                        icon={RestartIcon}
                        onClick={() => onRestart()}
                    />
                    <LargeLink
                        to="/"
                        text="Inny tryb gry"
                    />
                </div>
            </div>
        </div>
    );
}
