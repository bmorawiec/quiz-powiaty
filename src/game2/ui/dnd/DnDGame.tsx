import { useContext } from "react";
import { ApplyIcon, Button } from "src/ui";
import { UnusedCards } from "./cards";
import { CellView } from "./cells";
import { DnDGameStoreContext } from "./hook";

export function DnDGame() {
    const useDnDGameStore = useContext(DnDGameStoreContext);
    const cellIds = useDnDGameStore((game) => game.cellIds);

    const verify = useDnDGameStore((game) => game.verify);

    return (
        <div className="size-full bg-gray-10 dark:bg-gray-95 rounded-[20px] grid grid-cols-[auto_400px]">
            <div className="flex flex-col relative overflow-y-auto border-r border-black/10
                scrollbar-color thumb-color-gray-25 track-color-gray-10">
                <h2 className="text-[20px] font-[500] mt-[47px] mb-[5px] text-gray-80 dark:text-gray-10 text-center">
                    Tytuł
                </h2>

                <Button
                    icon={ApplyIcon}
                    text="Sprawdź"
                    className="absolute top-[45px] right-[45px]"
                    onClick={verify}
                />

                <div className="flex flex-col gap-[10px] p-[20px]">
                    {cellIds.map((cellId) =>
                        <CellView
                            key={cellId}
                            cellId={cellId}
                        />
                    )}
                </div>
            </div>

            <div className="overflow-hidden">
                <UnusedCards/>
            </div>
        </div>
    );
}
