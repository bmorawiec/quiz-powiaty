import clsx from "clsx";
import { useContext } from "react";
import { QuestionNotFoundError } from "src/game2/api";
import { type ChoiceScreen } from "src/game2/state";
import { ChoiceGameStoreContext } from "../hook";
import { ButtonView } from "./ButtonView";

export interface ScreenViewProps {
    screen: ChoiceScreen;
}

/** Displays the text of the question associated with this screen and its possible answers.
 *  Shows how many points were awarded for the question, if it has been answered. */
export function ScreenView({ screen }: ScreenViewProps) {
    const useChoiceGameStore = useContext(ChoiceGameStoreContext);

    const question = useChoiceGameStore((game) => game.api.questions[screen.questionId]);
    if (!question) throw new QuestionNotFoundError(screen.questionId)

    return (
        <div className="flex flex-col items-center">
            <div className="w-full h-[56px] grid grid-cols-[60px_auto_60px]">
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
            <div className="w-full grid grid-cols-2 md:grid-cols-3 gap-[10px]">
                {screen.buttonIds.map((buttonId) =>
                    <ButtonView
                        key={buttonId}
                        buttonId={buttonId}
                        disabled={question.guessed}
                    />
                )}
            </div>
        </div>
    );
}
