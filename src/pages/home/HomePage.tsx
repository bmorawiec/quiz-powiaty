import { BgMap } from "./map";
import { ModePicker } from "./ModePicker";

export function HomePage() {
    return (
        <div className="relative flex-1">
            <BgMap/>
            <ModePicker/>
        </div>
    );
}
