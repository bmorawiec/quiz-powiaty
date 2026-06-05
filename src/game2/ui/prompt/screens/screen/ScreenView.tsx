import { useContext } from "react";
import { QuestionNotFoundError } from "src/game2/questions";
import { type PromptScreen } from "src/game2/state";
import { PromptGameStoreContext } from "../../hook";
import { Guesses } from "./Guesses";
import { PromptInput } from "./PromptInput";
import { QuestionView } from "./question";

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

    return (<>
        <QuestionView question={question}/>

        <div className="flex flex-col items-center">
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
    </>);
}
