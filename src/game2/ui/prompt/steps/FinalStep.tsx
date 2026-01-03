import { useContext } from "react";
import type { FinalPromptScreen } from "src/game2/state";
import { FlagIcon, Step } from "src/ui";
import { PromptGameStoreContext } from "../hook";

export interface FinalStepProps {
    screen: FinalPromptScreen;
}

/** Shows a Step component corresponding to the final screen.
 *  Switches to the final screen when clicked. This is only allowed if the final screen has been reached. */
export function FinalStep({ screen }: FinalStepProps) {
    const usePromptGameStore = useContext(PromptGameStoreContext);
    const currentScreenId = usePromptGameStore((game) => game.currentScreenId);
    const switchScreens = usePromptGameStore((game) => game.switchScreens);

    return (
        <Step
            icon={FlagIcon}
            selected={currentScreenId === screen.id}
            onClick={(screen.reached)
                ? () => switchScreens(screen.id)
                : undefined
            }
        />
    );
}
