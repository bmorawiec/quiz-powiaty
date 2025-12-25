import { useContext } from "react";
import { Step, Stepper } from "src/ui";
import { ChoiceGameStoreContext } from "./hook";
import { ScreenView } from "./ScreenView";
import clsx from "clsx";

export function ChoiceGame() {
    const useChoiceGameStore = useContext(ChoiceGameStoreContext);

    const apiOptions = useChoiceGameStore((game) => game.api.options);

    const screenIds = useChoiceGameStore((game) => game.screenIds);
    const currentScreenId = useChoiceGameStore((game) => game.currentScreenId);
    const switchScreens = useChoiceGameStore((game) => game.switchScreens);

    return (
        <div className="size-full bg-gray-10 rounded-[20px] px-[20px] py-[50px]
            flex flex-col items-center md:justify-end">
            <div className={clsx((["flag", "coa"].includes(apiOptions.guess)) ? "md:h-[526px]" : "md:h-[290px]",
                "w-full max-w-[1000px] flex flex-col gap-[30px]")}>
                <Stepper>
                    {screenIds.map((screenId, index) =>
                        <Step
                            key={screenId}
                            number={index + 1}
                            selected={screenId === currentScreenId}
                            onClick={() => switchScreens(screenId)}
                        />
                    )}
                    <Step
                        last
                        selected={currentScreenId === "finishScreen"}
                        onClick={() => switchScreens("finishScreen")}
                    />
                </Stepper>

                {(currentScreenId === "finishScreen") ? (
                    "FinishScreen"
                ) : (
                    <ScreenView screenId={currentScreenId}/>
                )}
            </div>
        </div>
    );
}
