import { useContext } from "react";
import { DnDGameStoreContext } from "../storeContext";
import { ImageTable } from "./ImageTable";
import { Table } from "./Table";
import { ApplyIcon, Button } from "src/ui";

export function View() {
    const useDnDGameStore = useContext(DnDGameStoreContext);
    const verify = useDnDGameStore((game) => game.verify);

    const options = useDnDGameStore((game) => game.options);
    const title = useDnDGameStore((state) => state.title);

    return (
        <div className="relative flex-1 bg-gray-5 dark:bg-gray-95 sm:rounded-[20px] flex flex-col items-center 
            pt-[48px] pb-[50px] max-sm:pb-[300px] px-[20px] overflow-y-auto">

            <h2 className="text-[20px] font-[500] mb-[28px] text-gray-80 dark:text-gray-10 text-center">
                {title}
            </h2>

            <Button
                icon={ApplyIcon}
                text="Sprawdź"
                className="absolute top-[45px] right-[45px]"
                onClick={verify}
            />

            {(options.guessFrom === "flag" || options.guessFrom === "coa") ? (
                <ImageTable/>
            ) : (
                <Table/>
            )}
        </div>
    );
}
