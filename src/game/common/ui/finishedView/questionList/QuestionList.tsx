import { AnswerNotFoundError, QuestionNotFoundError, type Answer, type Question } from "../../../state";
import type { GameOptions } from "src/gameOptions";
import { QuestionCard } from "./QuestionCard";

export interface QuestionListProps {
    questions: Record<string, Question | undefined>;
    questionIds: string[];
    allAnswers: Record<string, Answer | undefined>;
    options: GameOptions;
}

export function QuestionList({ questions, questionIds, allAnswers, options }: QuestionListProps) {
    return (
        <div className="flex flex-col gap-[11px]">
            {questionIds.map((questionId, index) => {
                const question = questions[questionId];
                if (!question)
                    throw new QuestionNotFoundError(questionId);

                const correctAnswers: Answer[] = [];
                for (const answerId of question.answerIds) {
                    const answer = allAnswers[answerId];
                    if (!answer)
                        throw new AnswerNotFoundError(answerId);

                    if (answer.correct) {
                        correctAnswers.push(answer);
                    }
                }

                return (
                    <QuestionCard
                        question={question}
                        questionIndex={index}
                        correctAnswers={correctAnswers}
                        options={options}
                    />
                );
            })}
        </div>
    );
}
