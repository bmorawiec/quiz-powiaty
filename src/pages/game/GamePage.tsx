import { useSearchParams } from "react-router";
import { Game } from "src/game/Game";
import { PageLayout } from "src/ui";
import { decodeGameURL } from "src/url";

export function GamePage() {
    const [searchParams] = useSearchParams();
    const options = decodeGameURL(searchParams);

    return (
        <PageLayout>
            {options && (
                <Game options={options}/>
            )}
        </PageLayout>
    );
}
