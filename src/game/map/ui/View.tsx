import { QuestionBar } from "./QuestionBar";
import { GameMap } from "./map";

export function View() {
    return (
        <div className="relative size-full">
            <GameMap/>
            <QuestionBar/>
        </div>
    );
}
