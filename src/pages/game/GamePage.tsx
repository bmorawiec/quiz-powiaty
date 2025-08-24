import { useSearchParams } from "react-router";
import { Game } from "src/game";
import { decodeGameURL } from "src/gameOptions";

export function GamePage() {
    const [searchParams] = useSearchParams();
    const options = decodeGameURL(searchParams);

    return options && (
        <Game options={options}/>
    );
}
