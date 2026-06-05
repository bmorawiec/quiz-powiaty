import clsx from "clsx";
import type { Question } from "src/game2/questions";
import { QuestionContentView } from "./QuestionContentView";

export interface QuestionViewProps {
    question: Question;
}

export function QuestionView({ question }: QuestionViewProps) {
    return (<>
        {question.guessed && (
            <div className="relative my-[-15px]">
                <span className={clsx("absolute right-0 top-[47px]",
                    "text-[18px] text-right font-[450] tracking-[0.01em] my-[-30px]",
                    (question.points > 0) ? "text-teal-75 dark:text-teal-70" : "text-red-60 dark:text-red-55")}>
                    +{question.points}pkt
                </span>
            </div>
        )}
        <QuestionContentView content={question.content}/>
    </>);
}
