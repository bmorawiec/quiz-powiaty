import clsx from "clsx";
import { useContext } from "react";
import { QuestionNotFoundError } from "src/game2/api";
import { type PromptScreen } from "src/game2/state";
import { PromptGameStoreContext } from "../../hook";
import { PromptInput } from "./PromptInput";
import { Guesses } from "./Guesses";

export interface ScreenViewProps {
    screen: PromptScreen;
}

/** Displays the text of the question associated with this screen and its possible answers.
 *  Shows how many points were awarded for the question, if it has been answered. */
export function ScreenView({ screen }: ScreenViewProps) {
    const usePromptGameStore = useContext(PromptGameStoreContext);

    const question = usePromptGameStore((game) => game.api.questions[screen.questionId]);
    if (!question) throw new QuestionNotFoundError(screen.questionId)

    const guess = usePromptGameStore((game) => game.guess);
    const handleGuess = (answer: string) => {
        return guess(answer);
    };

    return (
        <div className="flex flex-col items-center overflow-hidden">
            <div className="w-full h-[56px] grid grid-cols-[60px_auto_60px] shrink-0">
                <div/>
                <h2 className="text-center text-[20px] font-[450] tracking-[0.01em] text-gray-85">
                    {question.content.text}
                </h2>
                {question.guessed && (
                    <span className={clsx("mt-[2px] text-[18px] font-[450] tracking-[0.01em] justify-self-end",
                        (question.points > 0) ? "text-teal-75" : "text-red-60")}>
                        +{question.points}pkt
                    </span>
                )}
            </div>

            {(question.guessed) ? (
                <Guesses
                    guesses={screen.guesses}
                />
            ) : (
                <PromptInput
                    answered={question.numberGuessed}
                    total={question.answerIds.length}
                    onGuess={handleGuess}
                />
            )}
        </div>
    );
}
