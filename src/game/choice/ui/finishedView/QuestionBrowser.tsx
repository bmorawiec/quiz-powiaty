import { useMemo, useState } from "react";
import { QuestionBrowserBase } from "src/game/common";
import { useChoiceGameStore } from "../../state";

export function QuestionBrowser() {
    const [current, setCurrent] = useState(0);
    const total = useChoiceGameStore((state) => state.questions.length);
    const question = useChoiceGameStore((state) => state.questions[current]);

    const answerText = useMemo(
        () => question.answers
            .find((option) => option.correct)!
            .text,
        [question],
    );

    const handlePrevClick = () => {
        if (current > 0) {
            setCurrent(current - 1);
        }
    };

    const handleNextClick = () => {
        if (current + 1 < total) {
            setCurrent(current + 1);
        }
    };

    return (
        <QuestionBrowserBase
            current={current}
            total={total}
            questionText={question.text}
            answerText={answerText}
            tries={question.tries}
            onPrevClick={handlePrevClick}
            onNextClick={handleNextClick}
        />
    )
}
