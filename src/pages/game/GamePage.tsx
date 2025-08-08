import { useSearchParams } from "react-router";
import { PromptGame } from "src/game/prompt";
import { PageLayout } from "src/ui";
import { decodeGameURL } from "src/url";

export function GamePage() {
    const [searchParams] = useSearchParams();
    const options = decodeGameURL(searchParams);

    return (
        <PageLayout>
            {options && options.gameType === "promptGame" && (
                <PromptGame options={options}/>
            )}
        </PageLayout>
    );
}
