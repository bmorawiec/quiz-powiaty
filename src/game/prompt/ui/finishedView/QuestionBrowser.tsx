import { useMemo, useState } from "react";
import { QuestionBrowserBase } from "src/game/common";
import { usePromptGameStore } from "../../state";

export function QuestionBrowser() {
    const [current, setCurrent] = useState(0);
    const total = usePromptGameStore((state) => state.prompts.length);
    const prompt = usePromptGameStore((state) => state.prompts[current]);

    const answerText = useMemo(
        () => prompt.answers
            .map((answer) => answer.text)
            .join(", "),
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
            questionText={prompt.text}
            answerText={answerText}
            tries={prompt.tries}
            onPrevClick={handlePrevClick}
            onNextClick={handleNextClick}
        />
    )
}
