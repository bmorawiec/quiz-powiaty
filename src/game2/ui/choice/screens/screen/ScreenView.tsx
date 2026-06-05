import { useContext } from "react";
import { QuestionNotFoundError } from "src/game2/questions";
import { type ChoiceScreen } from "src/game2/state";
import { ChoiceGameStoreContext } from "../../hook";
import { ButtonView } from "./button/ButtonView";
import { QuestionView } from "./question";

export interface ScreenViewProps {
    screen: ChoiceScreen;
}

/** Displays the text of the question associated with this screen and its possible answers.
 *  Shows how many points were awarded for the question, if it has been answered. */
export function ScreenView({ screen }: ScreenViewProps) {
    const useChoiceGameStore = useContext(ChoiceGameStoreContext);

    const question = useChoiceGameStore((game) => game.api.questions[screen.questionId]);
    if (!question) throw new QuestionNotFoundError(screen.questionId)

    return (<>
        <QuestionView question={question}/>

        <div className="w-full grid grid-cols-2 md:grid-cols-3 gap-[10px]">
            {screen.buttonIds.map((buttonId) =>
                <ButtonView
                    key={buttonId}
                    buttonId={buttonId}
                    disabled={question.guessed}
                />
            )}
        </div>
    </>);
}
