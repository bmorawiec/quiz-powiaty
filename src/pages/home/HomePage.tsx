import { PageLayout } from "src/ui";
import { ModePicker } from "./ModePicker";

export function HomePage() {

    return (
        <PageLayout>
            <div className="flex-1 flex bg-grass-10 dark:bg-gray-90 px-[20px] lg:px-[120px] py-[20px]">
                <ModePicker/>
            </div>
        </PageLayout>
    );
}
