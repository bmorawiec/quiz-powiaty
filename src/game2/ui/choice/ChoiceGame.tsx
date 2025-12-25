import clsx from "clsx";
import { useContext } from "react";
import { Stepper } from "src/ui";
import { ChoiceStep } from "./choiceStep";
import { ChoiceGameStoreContext } from "./hook";
import { CurrentScreen } from "./CurrentScreen";

export function ChoiceGame() {
    const useChoiceGameStore = useContext(ChoiceGameStoreContext);
    const apiOptions = useChoiceGameStore((game) => game.api.options);
    const screenIds = useChoiceGameStore((game) => game.screenIds);

    return (
        <div className="size-full bg-gray-10 rounded-[20px] px-[20px] py-[50px]
            flex flex-col items-center md:justify-end">
            <div className={clsx((["flag", "coa"].includes(apiOptions.guess)) ? "md:h-[526px]" : "md:h-[290px]",
                "w-full max-w-[1000px] flex flex-col gap-[30px]")}>
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
