import { useContext } from "react";
import { Step, Stepper } from "src/ui";
import { ChoiceGameStoreContext } from "./hook";
import { ScreenView } from "./ScreenView";

export function ChoiceGame() {
    const useChoiceGameStore = useContext(ChoiceGameStoreContext);
    const screenIds = useChoiceGameStore((game) => game.screenIds);
    const currentScreenId = useChoiceGameStore((game) => game.currentScreenId);
    const switchScreens = useChoiceGameStore((game) => game.switchScreens);

    return (
        <div className="size-full bg-gray-10 rounded-[20px] py-[50px] flex flex-col items-center justify-end">
            <div className="w-full max-w-[1000px] flex flex-col gap-[30px]">
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
