import { useSearchParams } from "react-router";
import { Game } from "src/game/Game";
import { decodeGameURL } from "src/url";

export function GamePage() {
    const [searchParams] = useSearchParams();
    const options = decodeGameURL(searchParams);

    return options && (
        <Game options={options}/>
    );
}
