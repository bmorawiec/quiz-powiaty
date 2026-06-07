import { Result } from "./Result";
import { Timer } from "./Timer";

export function GameStatus() {
    return (
        <div className="px-[28px] py-[15px] mt-[19px] grid grid-cols-2 gap-y-[15px]
            font-[450] tracking-[0.02em] text-[14px]">
            <p className="text-gray-60 dark:text-gray-45">
                Czas
            </p>
            <Timer/>

            <p className="text-gray-60 dark:text-gray-45">
                Aktualny wynik
            </p>
            <Result/>
        </div>
    );
}
