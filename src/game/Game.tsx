import { lazy } from "react";
import { useSearchParams } from "react-router";
import { decodeGameURL, validateGameOptions } from "src/gameOptions";
import { GameError } from "./common/ui/GameError";

const ChoiceGame = lazy(() => import("./choice"));
const PromptGame = lazy(() => import("./prompt"));
const TypingGame = lazy(() => import("./typing"));

export function Game() {
    const [searchParams] = useSearchParams();
    const options = decodeGameURL(searchParams);

    if (options && validateGameOptions(options)) {
        if (options.gameType === "choiceGame") {
            return <ChoiceGame options={options}/>;
        } else if (options.gameType === "promptGame") {
            return <PromptGame options={options}/>;
        } else if (options.gameType === "typingGame") {
            return <TypingGame options={options}/>;
        }
        return null;
    } else {
        return (
            <GameError
                details="Podany adres gry jest nieprawidłowy. Upewnij się, że adres jest poprawny,
                    albo spróbuj wybrać inny tryb gry."
            />
        );
    }
}
