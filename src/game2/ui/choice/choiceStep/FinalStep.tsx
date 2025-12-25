import { useContext } from "react";
import type { FinalChoiceScreen } from "src/game2/state";
import { FlagIcon, Step } from "src/ui";
import { ChoiceGameStoreContext } from "../hook";

export interface FinalStepProps {
    screen: FinalChoiceScreen;
}

export function FinalStep({ screen }: FinalStepProps) {
    const useChoiceGameStore = useContext(ChoiceGameStoreContext);
    const currentScreenId = useChoiceGameStore((game) => game.currentScreenId);
    const switchScreens = useChoiceGameStore((game) => game.switchScreens);

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
