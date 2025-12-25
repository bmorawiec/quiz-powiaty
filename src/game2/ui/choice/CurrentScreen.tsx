import { useContext } from "react";
import { ChoiceScreenNotFoundError } from "src/game2/state";
import { FinalScreenView } from "./FinalScreenView";
import { ChoiceGameStoreContext } from "./hook";
import { ScreenView } from "./ScreenView";

export function CurrentScreen() {
    const useChoiceGameStore = useContext(ChoiceGameStoreContext);

    const currentScreenId = useChoiceGameStore((game) => game.currentScreenId);
    const currentScreen = useChoiceGameStore((game) => game.screens[currentScreenId]);
    if (!currentScreen)
        throw new ChoiceScreenNotFoundError(currentScreenId);

    if (currentScreen.final) {
        return <FinalScreenView/>;
    } else {
        return <ScreenView screen={currentScreen}/>;
    }
}
