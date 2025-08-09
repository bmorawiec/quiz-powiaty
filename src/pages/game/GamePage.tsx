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
                <Game
                    // ensure the game component is reloaded each time the URL (and with it the game options) changes
                    key={window.location.href}
                    options={options}
                />
            )}
        </PageLayout>
    );
}
