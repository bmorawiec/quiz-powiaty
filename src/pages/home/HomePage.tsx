import { BackgroundMap } from "./BackgroundMap";
import { ModePicker } from "./ModePicker";

export function HomePage() {
    return (
        <div className="relative flex-1">
            <BackgroundMap/>
            <ModePicker/>
        </div>
    );
}
