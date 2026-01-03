import { useContext } from "react";
import { PromptScreenNotFoundError } from "src/game2/state";
import { PromptGameStoreContext } from "../hook";
import { FinalScreenView } from "./finalScreen";
import { ScreenView } from "./screen";

export function CurrentScreen() {
    const usePromptGameStore = useContext(PromptGameStoreContext);

    const currentScreenId = usePromptGameStore((game) => game.currentScreenId);
    const currentScreen = usePromptGameStore((game) => game.screens[currentScreenId]);
    if (!currentScreen)
        throw new PromptScreenNotFoundError(currentScreenId);

    if (currentScreen.final) {
        return <FinalScreenView/>;
    } else {
        return <ScreenView screen={currentScreen}/>;
    }
}
