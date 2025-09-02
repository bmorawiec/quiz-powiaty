import { useMemo, useState } from "react";
import { QuestionBrowserBase } from "src/game/common";
import { useChoiceGameStore } from "../../state";

export function QuestionBrowser() {
    const [current, setCurrent] = useState(0);
    const total = useChoiceGameStore((state) => state.questions.length);
    const prompt = useChoiceGameStore((state) => state.questions[current]);

    const answerText = useMemo(
        () => prompt.options
            .find((option) => option.correct)!
            .value,
        [prompt],
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
            questionText={prompt.value}
            answerText={answerText}
            tries={prompt.tries}
            onPrevClick={handlePrevClick}
            onNextClick={handleNextClick}
        />
    )
}
