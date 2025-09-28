import type { Answer } from "src/game/common/state";
import type { GameOptions } from "src/gameOptions";

export interface QuestionAnswersProps {
    answers: Answer[];
    options: GameOptions;
}

export function QuestionAnswers({ answers, options }: QuestionAnswersProps) {
    if (options.guess === "flag" || options.guess === "coa") {
        return (<>
            <p>
                Poprawna odpowiedź:
            </p>
            <div className="flex gap-[10px]">
                {answers.map((answer) =>
                    <img
                        src={answer.value}
                        className="w-[100px]"
                    />
                )}
            </div>
        </>);
    }

    const answerText = answers
        .map((answer) => answer.value)
        .join();
    return (
        <p>
            Poprawna odpowiedź: {answerText}
        </p>
    );
}
