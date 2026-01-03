import clsx from "clsx";
import { useContext } from "react";
import { Stepper } from "src/ui";
import { PromptGameStoreContext } from "./hook";
import { CurrentScreen } from "./screens";
import { PromptStep } from "./steps";

/** Shows the game UI.
 *  Has to be inside a PromptGameStoreContext. */
export function PromptGame() {
    const usePromptGameStore = useContext(PromptGameStoreContext);
    const apiOptions = usePromptGameStore((game) => game.api.options);
    const screenIds = usePromptGameStore((game) => game.screenIds);

    return (
        <div className="size-full bg-gray-10 rounded-[20px] px-[20px] py-[50px]
            flex flex-col items-center md:justify-end">
            <div className={clsx((["flag", "coa"].includes(apiOptions.guess)) ? "md:h-[526px]" : "md:h-[290px]",
                "w-full max-w-[1000px] flex flex-col gap-[30px]")}>
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
