import { useContext } from "react";
import { Stepper } from "src/ui";
import { PromptGameStoreContext } from "./hook";
import { CurrentScreen } from "./screens";
import { PromptStep } from "./steps";

/** Shows the game UI.
 *  Has to be inside a PromptGameStoreContext. */
export function PromptGame() {
    const usePromptGameStore = useContext(PromptGameStoreContext);
    const screenIds = usePromptGameStore((game) => game.screenIds);

    return (
        <div className="size-full bg-gray-10 dark:bg-gray-95 rounded-[20px] px-[20px] py-[50px]
            flex flex-col items-center">
            <div className="w-full h-full max-w-[1000px] flex flex-col gap-[30px] md:justify-end">
                <Stepper>
                    {screenIds.map((screenId, index) =>
                        <PromptStep
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
