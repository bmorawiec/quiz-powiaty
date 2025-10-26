import { useContext } from "react";
import { QuestionNotFoundError } from "src/game/common";
import { LocationIcon } from "src/ui";
import { MapGameStoreContext } from "../storeContext";

export function QuestionBar() {
    const useMapGameStore = useContext(MapGameStoreContext);

    const questionId = useMapGameStore((game) => game.current);
    const question = useMapGameStore((game) => game.questions[questionId]);
    if (!question)
        throw new QuestionNotFoundError(questionId);

    return (
        <div className="absolute left-[15px] right-[15px] bottom-[15px] rounded-[20px] px-[15px] h-[60px]
            flex items-center gap-[10px] shadow-sm shadow-black/10
            bg-white dark:bg-black">
            <div className="size-[30px] rounded-[6px] bg-gray-15 dark:bg-gray-80 flex items-center justify-center">
                <LocationIcon/>
            </div>

            <h2 className="font-[450] text-gray-80">
                {question.value}
            </h2>
        </div>
    );
}
