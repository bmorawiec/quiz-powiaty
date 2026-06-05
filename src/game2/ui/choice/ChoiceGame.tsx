import { useContext } from "react";
import { Stepper } from "src/ui";
import { ChoiceGameStoreContext } from "./hook";
import { CurrentScreen } from "./screens";
import { ChoiceStep } from "./steps";

/** Shows the game UI.
 *  Has to be inside a ChoiceGameStoreContext. */
export function ChoiceGame() {
    const useChoiceGameStore = useContext(ChoiceGameStoreContext);
    const screenIds = useChoiceGameStore((game) => game.screenIds);

    return (
        <div className="size-full bg-gray-10 dark:bg-gray-95 rounded-[20px] px-[20px] py-[50px]
            flex flex-col items-center">
            <div className="w-full h-full max-w-[1000px] flex flex-col gap-[30px] md:justify-end">
                <Stepper>
                    {screenIds.map((screenId, index) =>
                        <ChoiceStep
                            key={screenId}
                            screenId={screenId}
                            index={index}
                        />
                    )}
                </Stepper>

                <CurrentScreen/>
            </div>
        </div>
    );
}
