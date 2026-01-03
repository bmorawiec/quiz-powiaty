import { useContext } from "react";
import { type ChoiceScreen } from "src/game2/state";
import { ApplyIcon, CloseIcon, Step } from "src/ui";
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

    return (
        <Step
            icon={(screen.state === "correct")
                ? ApplyIcon
                : (screen.state === "incorrect")
                    ? CloseIcon
                    : undefined}
            number={(screen.state !== "unanswered")
                ? index + 1
                : undefined}
            selected={screen.id === currentScreenId}
            onClick={(screen.state !== "unanswered")
                ? () => switchScreens(screen.id)
                : undefined}
        />
    );
}
