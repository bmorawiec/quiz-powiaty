import { useContext } from "react";
import { QuestionNotFoundError } from "src/game2/api";
import { type ChoiceScreen } from "src/game2/state";
import { ApplyIcon, CloseIcon, CrownIcon, Step } from "src/ui";
import { ChoiceGameStoreContext } from "../hook";

export interface QuestionStepProps {
    screen: ChoiceScreen;
    index: number;
}

/** Shows a Step component corresponding to a ChoiceScreen.
 *  Switches to the appropriate screen on click. This is only allowed if the question associated with that screen
 *  has been answered. */
export function QuestionStep({ screen, index }: QuestionStepProps) {
    const useChoiceGameStore = useContext(ChoiceGameStoreContext);
    const currentScreenId = useChoiceGameStore((game) => game.currentScreenId);
    const switchScreens = useChoiceGameStore((game) => game.switchScreens);

    const numberGuessed = useChoiceGameStore((game) => game.api.numberGuessed);

    const question = useChoiceGameStore((game) => game.api.questions[screen.questionId]);
    if (!question)
        throw new QuestionNotFoundError(screen.questionId);

    const handleClick = () => {
        switchScreens(screen.id);
    };

    return (
        <Step
            icon={(index < numberGuessed)
                ? (question.points === 4)
                    ? CrownIcon
                    : (question.points > 0)
                        ? ApplyIcon
                        : CloseIcon
                : undefined}
            number={(index <= numberGuessed) ? index + 1 : undefined}
            selected={screen.id === currentScreenId}
            onClick={(index <= numberGuessed) ? handleClick : undefined}
        />
    );
}
