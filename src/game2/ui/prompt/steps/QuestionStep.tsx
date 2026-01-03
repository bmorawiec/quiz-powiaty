import { useContext } from "react";
import { QuestionNotFoundError } from "src/game2/api";
import { type PromptScreen } from "src/game2/state";
import { ApplyIcon, CloseIcon, CrownIcon, Step } from "src/ui";
import { PromptGameStoreContext } from "../hook";

export interface QuestionStepProps {
    screen: PromptScreen;
    index: number;
}

/** Shows a Step component corresponding to a PromptScreen.
 *  Switches to the appropriate screen on click. This is only allowed if the question associated with that screen
 *  has been answered. */
export function QuestionStep({ screen, index }: QuestionStepProps) {
    const usePromptGameStore = useContext(PromptGameStoreContext);
    const currentScreenId = usePromptGameStore((game) => game.currentScreenId);
    const switchScreens = usePromptGameStore((game) => game.switchScreens);

    const numberGuessed = usePromptGameStore((game) => game.api.numberGuessed);

    const question = usePromptGameStore((game) => game.api.questions[screen.questionId]);
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
