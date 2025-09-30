import { ModePicker } from "./ModePicker";

export function HomePage() {
    return (
        <div className="relative relative flex-1 flex gap-[40px]">
            <div className="absolute left-0 top-0 w-full h-[280px] bg-grass-10 dark:bg-gray-90"/>
            <div className="absolute left-0 top-0 w-full px-[20px] lg:px-[100px] pt-[20px] flex gap-[40px]">
                <ModePicker/>
            </div>
        </div>
    );
}
