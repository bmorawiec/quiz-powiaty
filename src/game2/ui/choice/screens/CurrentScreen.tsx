import { useContext } from "react";
import { ChoiceScreenNotFoundError } from "src/game2/state";
import { ChoiceGameStoreContext } from "../hook";
import { FinalScreenView } from "./finalScreen";
import { ScreenView } from "./screen";

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
