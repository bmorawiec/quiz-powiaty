import { useContext } from "react";
import { LargeButton, RestartIcon } from "src/ui";
import { ChoiceGameStoreContext } from "../../hook";

/** Shows the final screen, which contains information about game results and a restart button. */
export function FinalScreenView() {
    const useChoiceGameStore = useContext(ChoiceGameStoreContext);

    const points = useChoiceGameStore((game) => game.api.points);
    const maxPoints = useChoiceGameStore((game) => game.api.maxPoints);
    const percent = Math.floor((points / maxPoints) * 100);

    const restart = useChoiceGameStore((game) => game.api.restart);

    return (
        <div className="flex-1 flex flex-col gap-[16px] items-center">
            <h2 className="text-[20px] font-[450] tracking-[0.01em] text-gray-85 dark:text-gray-10">
                Twój wynik
            </h2>

            <div className="w-full flex-1 flex flex-col md:grid md:grid-cols-2 gap-[10px]">
                <div className="bg-black/4 dark:bg-white/4 rounded-[10px] font-bold text-[28px] tracking-[-0.03em]
                    p-[10px] flex items-center justify-center text-gray-80 dark:text-gray-20">
                    {points}/{maxPoints}pkt, czyli {percent}%
                </div>

                <div className="bg-black/4 dark:bg-white/4 rounded-[10px] flex items-center justify-center">
                </div>
            </div>

            <LargeButton
                primary
                text="Zagraj ponownie"
                icon={RestartIcon}
                className="w-[350px]"
                onClick={restart}
            />
        </div>
    );
}
